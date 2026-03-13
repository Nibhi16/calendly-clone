# 🚀 MeetFlow — Smart Meeting Scheduling Platform

MeetFlow is a **full-stack meeting scheduling application inspired by Calendly** that allows users to create event types, define availability, and share booking links for seamless meeting scheduling.

It eliminates the back-and-forth of emails by letting guests choose available time slots and automatically schedule meetings.

Built using a **modern full-stack architecture with Next.js, Express, Prisma, and Neon PostgreSQL**.

---

# ✨ Features

### 📅 Smart Scheduling
- Create customizable **event types**
- Configure meeting **duration and booking links**
- Automatic **time slot generation**

### ⏰ Availability Management
- Define weekly availability windows
- Prevent overlapping schedules
- Timezone-aware scheduling

### 👥 Meeting Management
- View **upcoming meetings**
- View **past meetings**
- Cancel meetings easily

### 🌍 Public Booking Pages
Guests can:
- Select a date from a calendar
- Choose an available time slot
- Submit their details
- Instantly book meetings

### 📧 Email Invitations
- Invite collaborators via **email**
- Implemented using **Nodemailer**

### 🗄 Database
- Hosted on **Neon PostgreSQL**
- Managed using **Prisma ORM**
- Preloaded with sample data using **seed scripts**

---

# 🛠 Tech Stack

## Frontend
- **Next.js**
- **React**
- **TailwindCSS**
- **Lucide Icons**

## Backend
- **Node.js**
- **Express.js**
- **REST API Architecture**

## Database
- **PostgreSQL (Neon Cloud)**
- **Prisma ORM**

## Tools & Libraries
- **Nodemailer** – Email invitations
- **Date-fns** – Date utilities
- **Prisma Studio** – Database GUI

---

# 🏗 System Architecture

```
Frontend (Next.js)
        │
        │ REST API
        ▼
Backend (Express Server)
        │
        │ Prisma ORM
        ▼
Neon PostgreSQL Database
```

---

# 📂 Project Structure

```
calendly-clone/
│
├── frontend (Next.js App)
│   ├── app
│   ├── components
│   ├── pages
│   └── styles
│
├── backend (Express API)
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── server.js
│
└── database
    └── Neon PostgreSQL
```

---

# 🗄 Database Schema

Core models used in the system:

### User
Stores user account and timezone data.

### EventType
Represents different meeting types users can create.

### Availability
Defines when a user is available for meetings.

### Booking
Stores scheduled meetings.

Relationships:

```
User
 ├── EventTypes
 ├── Availability
 └── Bookings (as host)

EventType
 └── Bookings
```

---

# ⚙ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/calendly-clone.git
cd calendly-clone
```

---

## 2️⃣ Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3️⃣ Environment Variables

Create `.env` inside the **backend** folder.

```
DATABASE_URL=your_neon_postgres_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 4️⃣ Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
node prisma/seed.js
```

---

## 5️⃣ Run the Backend Server

```bash
npm run dev
```

Backend will run on:

```
http://localhost:4000
```

---

## 6️⃣ Run the Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

# 🔌 API Endpoints

### Event Types

```
GET    /event-types
POST   /event-types
PUT    /event-types/:id
DELETE /event-types/:id
```

### Availability

```
GET    /availability
POST   /availability
DELETE /availability/:id
```

### Bookings

```
GET    /bookings/upcoming
GET    /bookings/past
DELETE /bookings/:id
```

### Slots

```
GET /slots?slug={eventSlug}&date={date}
```

---

# 📸 Screenshots

Add screenshots of:

- Scheduling dashboard
- Availability management
- Meeting dashboard
- Public booking page

---

# 🚀 Future Improvements

Potential enhancements for production:

- 🔐 Authentication (JWT / OAuth)
- 📅 Google Calendar integration
- 🎥 Zoom / Google Meet links
- 👥 Team scheduling

---

# 👨‍💻 Author

**Nibhi Garg**

GitHub  
https://github.com/Nibhi16

---
