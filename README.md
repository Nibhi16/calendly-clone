## MeetFlow – Smart Meeting Scheduling

MeetFlow is a **Calendly-style scheduling platform** that demonstrates a clean, modular, production-style architecture across:

- **Frontend**: Next.js (App Router) SPA with Tailwind CSS
- **Backend**: Node.js + Express, MVC-style
- **Database**: PostgreSQL
- **ORM**: Prisma

Users (assumed single default user for this assignment) configure **event types** and **weekly availability**. Visitors can then book meetings using a public `/book/{slug}` link. **Time slots are not stored in the database**; they are generated dynamically from availability + event duration − booked meetings.

---

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS 3
  - TypeScript
- **Backend**
  - Node.js 18+
  - Express 4
  - CORS
- **Database & ORM**
  - PostgreSQL
  - Prisma ORM

---

## Project Structure

```text
root
  backend
    controllers       # Express controllers (HTTP layer)
    routes            # Express route definitions
    services          # Business logic and Prisma calls
    utils             # Prisma client singleton, error handler
    middleware        # Default user attachment
    prisma
      schema.prisma   # Prisma data model
      seed.js         # Seed script with demo data
    server.js         # Express app entry

  frontend
    app
      event-types     # Event type listing / creation
      availability    # Weekly availability configuration
      book/[slug]     # Public booking flow per event slug
      meetings        # Upcoming / past meetings
      layout.tsx      # Root layout with sidebar
      page.tsx        # Redirects to /event-types
    components
      Layout          # Admin layout (sidebar + content)
      Sidebar         # Left navigation
      EventTypeCard   # Card for each event type
      Calendar        # Minimal month calendar
      TimeSlotList    # List of generated time slots
      BookingForm     # Public booking form
      MeetingCard     # Card for upcoming/past meetings
```

---

## Database Design (Prisma)

### Models

- `User`
  - Owns `EventType` and `Availability`
  - Acts as host for `Booking`
- `EventType`
  - Represents a booking link (e.g. "30 min meeting")
  - Fields: `title`, `description`, `durationMinutes`, `slug`, `visibility`, `isActive`, buffers, notice windows, `userId`
- `Availability`
  - Weekly recurring windows
  - Fields: `dayOfWeek`, `startTime`, `endTime`, `timeZone`, `eventTypeId?`, `userId`
- `Booking`
  - A single meeting
  - Fields: `eventTypeId`, `hostId`, `guestEmail`, `guestName`, `status`, `startTime`, `endTime`, `hostTimeZone`, `guestTimeZone`

### Enums

- `DayOfWeek` – `MONDAY`..`SUNDAY`
- `BookingStatus` – `PENDING`, `CONFIRMED`, `CANCELED`
- `EventTypeVisibility` – `PUBLIC`, `PRIVATE`

**Key rule**: time slots are not persisted; they are generated dynamically.

---

## Environment Variables

Create a `.env` file in `backend`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

Create a `.env.local` file in `frontend`:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

---

## Backend – Setup & Run

From `backend/`:

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database with a default user, event types, availability, and sample bookings
npm run seed

# Start dev server
npm run dev
```

The API will be available at `http://localhost:4000`.

### API Overview

All authenticated routes attach a **default user** via middleware (`middleware/defaultUser.js`) by loading the first `User` from the database. This keeps the focus on scheduling logic rather than auth.

#### Event Types

- `GET /event-types` – list event types for the default user
- `POST /event-types` – create an event type
- `PUT /event-types/:id` – update an event type
- `DELETE /event-types/:id` – delete an event type

Each event type exposes a public booking link:

- `/book/{slug}` – used by the frontend booking page

#### Availability

- `GET /availability` – list weekly availability windows
- `POST /availability` – create an availability window
- `PUT /availability/:id` – update an availability window
- `DELETE /availability/:id` – delete an availability window

Each window includes:

- `dayOfWeek`
- `startTime` / `endTime` in **minutes from midnight**
- `timeZone` (string)

#### Slot Generation (Public)

- `GET /slots?slug={eventSlug}&date={YYYY-MM-DD}`

Logic implemented in `services/slotService.js`:

1. Find `EventType` using `slug`.
2. Determine `durationMinutes`.
3. Determine `dayOfWeek` for the selected date.
4. Fetch availability for that weekday and host.
5. For each availability window, generate slots between `startTime` and `endTime`.
6. Step size = `durationMinutes` (e.g. 30 minutes).
7. Fetch existing bookings for that date and event type.
8. **Filter out** any slot whose `startTime` is already booked.

Slots are returned as:

```json
[
  { "startTime": "2026-03-12T09:00:00.000Z", "endTime": "2026-03-12T09:30:00.000Z" },
  ...
]
```

#### Bookings

- `POST /bookings`
  - Body: `{ eventSlug, date, startTime, guestName, guestEmail }`
  - Finds event type by slug
  - Computes `endTime` from `startTime` + `durationMinutes`
  - Checks if a booking already exists for the same `eventTypeId` and `startTime`
  - Prevents double booking
  - Creates `Booking` row and returns it

- `GET /bookings/upcoming`
  - Returns bookings where `startTime > now` and `status != CANCELED`

- `GET /bookings/past`
  - Returns bookings where `startTime < now`

- `DELETE /bookings/:id`
  - Marks the booking as `CANCELED`

---

## Frontend – Setup & Run

From `frontend/`:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at `http://localhost:3000` and expects the backend at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:4000`).

### Pages

- `/event-types`
  - Lists all event types for the default user.
  - Simple form to create new event types (`title`, `durationMinutes`, `slug`).
  - Displays the public booking link `/book/{slug}`.

- `/availability`
  - Weekly availability management:
    - Day-of-week selector
    - Start and end time (HTML time inputs)
    - Timezone text field
  - Shows existing windows with ability to delete them.

- `/book/[slug]`
  - Public booking page.
  - **Layout**:
    - Left: month `Calendar` to choose a date.
    - Right: `TimeSlotList` generated from `/slots`, plus `BookingForm`.
  - Flow:
    1. User hits the page using a URL like `/book/30-min-meeting`.
    2. Calendar loads; selecting a date calls `GET /slots?slug=&date=`.
    3. Time slots are rendered as buttons.
    4. User fills name and email in `BookingForm`.
    5. `POST /bookings` is called.
    6. Confirmation message is shown.

- `/meetings`
  - Shows `upcoming` meetings and `past` meetings using `MeetingCard`.
  - Upcoming meetings support a **cancel** action (DELETE `/bookings/:id`).

### UI & Layout

- Admin layout uses a **left sidebar** (`Sidebar`) with navigation:
  - Event Types
  - Availability
  - Meetings
- Content uses a clean, minimal Tailwind design:
  - Light background, white cards, soft borders.
  - Consistent `text-xs` / `text-sm` typography and spacing.
  - Primary color `#0052CC` for buttons and highlights.

---

## Deployment Notes

### Backend

- Host on **Render**, **Railway**, or similar.
- Ensure environment variables:
  - `DATABASE_URL` (PostgreSQL)
  - `PORT`
  - `CLIENT_ORIGIN` set to your frontend URL.
- Run migrations and seed:

```bash
npx prisma migrate deploy
npm run seed
```

### Frontend

- Deploy on **Vercel**.
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL
  (e.g. `https://your-backend.onrender.com`).

---

## How to Explain in an Interview

- **Architecture**: Emphasize the clear separation of concerns:
  - Routes → Controllers → Services → Prisma (data access)
  - Frontend UI → pages (screens) vs components (reusable building blocks)
- **Time slot generation**:
  - Explain that slots are **derived**, not stored, which:
    - Avoids data explosion
    - Keeps logic flexible for different durations and availabilities
  - Mention filtering by existing bookings to prevent double booking.
- **Trade-offs**:
  - Simple “default user” middleware in place of full auth to keep focus on scheduling logic.
  - Use of minutes-from-midnight integers in `Availability` for simple slot math.

This gives you a realistic, well-structured codebase to walk through while still being small enough to understand end-to-end in an interview.

