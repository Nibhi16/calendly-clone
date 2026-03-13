# MeetFlow — A Calendly-Style Scheduling Platform

MeetFlow is a full-stack scheduling application inspired by Calendly.  
The goal of this project was to build a clean and functional scheduling platform where users can create event types, define their availability, and allow others to book meetings through a public link.

Instead of going back and forth over email trying to find a time that works, MeetFlow lets people simply pick an available slot and schedule instantly.

This project was built as part of an SDE Full-Stack assignment and focuses on clean architecture, thoughtful database design, and a user experience similar to modern scheduling tools.

---

## Live Demo

deployed link :- https://meet-flow-two.vercel.app/

---

## What the Application Can Do

### Event Types
Users can create different types of meetings such as:

- 30 minute meeting
- 60 minute deep dive
- Interview session
- Quick intro call

Each event type has its own public booking URL.

Example:

```
/book/30-min-meeting
```

From there, guests can schedule directly.

Users can also edit or delete event types at any time.

---

### Availability Management

Users can define when they are available during the week.

For example:

```
Monday – Friday
9:00 AM – 5:00 PM
```

The system automatically generates time slots based on these availability windows and the duration of the event type.

Overlap between availability windows is prevented.

---

### Public Booking Page

Guests visiting a booking link can:

1. Select a date from the calendar
2. View available time slots for that date
3. Enter their name and email
4. Book the meeting

Once the booking is confirmed, the meeting is saved and the time slot becomes unavailable.

This prevents double bookings.

---

### Meetings Dashboard

The host can view:

- Upcoming meetings
- Past meetings

Upcoming meetings can also be cancelled directly from the dashboard.

---

### Email Invitations

The application includes an email invite feature that allows users to invite collaborators.

Email sending is implemented using **Nodemailer**.

Note: SMTP connections are blocked on Render’s free tier, so email works locally but may not send in the deployed version. In production this would typically be replaced with an email API provider like Resend or SendGrid.

---

## Tech Stack

### Frontend
Next.js  
React  
TailwindCSS  

### Backend
Node.js  
Express.js  

### Database
PostgreSQL (Neon)  
Prisma ORM  

### Other Tools
Nodemailer for email invitations  
Date-fns for date utilities  

---

## Project Structure

```
meetflow
│
├── frontend
│   ├── app
│   ├── components
│   └── pages
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   └── prisma
│
└── database
    └── Neon PostgreSQL
```

The backend follows a simple separation of concerns:

- **Routes** handle API endpoints
- **Controllers** manage request logic
- **Services** contain business logic
- **Prisma** handles database access

---

## Database Design

The application uses four main models:

**User**  
Represents the host using the scheduling platform.

**EventType**  
Defines different meeting types with duration and booking slug.

**Availability**  
Stores weekly availability windows.

**Booking**  
Represents confirmed meetings.

Relationships:

```
User
 ├── EventTypes
 ├── Availability
 └── Bookings

EventType
 └── Bookings
```

---

## Running the Project Locally

Clone the repository:

```
git clone https://github.com/your-username/meetflow.git
cd meetflow
```

Install backend dependencies:

```
cd backend
npm install
```

Install frontend dependencies:

```
cd frontend
npm install
```

---

### Environment Variables

Create a `.env` file in the backend folder:

```
DATABASE_URL=your_neon_database_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

### Database Setup

Generate Prisma client:

```
npx prisma generate
```

Run migrations:

```
npx prisma migrate dev
```

Seed sample data:

```
node prisma/seed.js
```

---

### Start Backend

```
npm run dev
```

Backend runs on:

```
http://localhost:4000
```

---

### Start Frontend

```
cd frontend
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## API Overview

Event Types

```
GET /event-types
POST /event-types
PUT /event-types/:id
DELETE /event-types/:id
```

Availability

```
GET /availability
POST /availability
DELETE /availability/:id
```

Bookings

```
GET /bookings/upcoming
GET /bookings/past
DELETE /bookings/:id
```

Slots

```
GET /slots?slug={eventSlug}&date={date}
```

---

## Things I Would Improve With More Time

Some features that would be great next steps:

- Authentication and multi-user accounts
- Google Calendar integration
- Automatic meeting links (Zoom / Google Meet)
- Rescheduling existing meetings
- Payment support for paid bookings

---

## Author

Nibhi Garg

GitHub  
https://github.com/Nibhi16

---
