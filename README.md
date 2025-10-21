# ⚖️ InjuryAI – Personal Injury Settlement Evaluation System

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Resend](https://img.shields.io/badge/-Resend-000000?style=flat-square&logo=mailgun&logoColor=white)
![OpenAI](https://img.shields.io/badge/-OpenAI-412991?style=flat-square&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![ShadCN UI](https://img.shields.io/badge/-ShadCN%20UI-000000?style=flat-square&logo=react&logoColor=white)

> 🚀 **InjuryAI** is an intelligent, full-stack system for evaluating personal injury cases.  
> It automatically analyzes Tally form submissions, generates AI-based settlement estimates, creates PDF reports, and emails results directly to clients — all with a live lawyer dashboard.

<p align="center">
  <img src="/frontend/public/main.PNG" alt="System Demo" width="850"/>
</p>

**Live Demo:** [https://injury-ai.vercel.app](https://injury-ai.vercel.app)

---

## 🧩 Overview

**InjuryAI** demonstrates a modern approach to automating legal case intake, analysis, and reporting using LLMs and real-time backend systems.  
It connects a public Tally form to a backend that processes client submissions, generates AI responses, and sends automated emails with attached PDFs — while displaying all submissions on a secure lawyer dashboard.

**Core Highlights**

- ⚖️ End-to-end automation from form to email and dashboard
- 🤖 AI-powered settlement estimation and rationale
- 📄 PDF generation with law-firm style layout
- 📬 Automated email delivery via Resend
- 🧾 Secure dashboard for reviewing all submissions
- 🔐 Supabase + Prisma for database and storage
- 🧱 Modular, production-ready architecture

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Future Improvements](#future-improvements)

---

## Features

### 🧠 AI Settlement Evaluation

- Backend calls the **OpenAI API** with form data to:
  - Estimate a **settlement range**
  - Generate a **short rationale**
  - List **2–3 similar past cases**
- Results are returned as structured JSON for easy parsing and report generation.

### 📄 PDF Report Generation

- Generates a professional one-page PDF using **pdf-lib**.
- Includes:
  - Law firm letterhead and branding
  - Case summary and client details
  - Settlement range visualization (bar graph)
  - AI rationale paragraph
  - List of similar cases with short summaries

### 📬 Automated Email Delivery

- Uses **Resend API** to email clients automatically.
- Includes personalized content and attached PDF.
- Clean, professional HTML template with placeholders.

### 🧾 Lawyer Dashboard

- Built with **Next.js + ShadCN UI + Tailwind**.
- Lists all submissions with columns for:
  - Name, email, treatment level, weeks, bills, lost wages, shared fault %, estimate, document count, and AI-generated score.
- Clean, minimal, responsive layout.

### ⚙️ Backend Integration

- **Express.js + TypeScript + Prisma** backend.
- Handles:
  - Webhook listener for Tally form submissions
  - LLM calls to OpenAI
  - PDF generation
  - Email delivery
  - Submission persistence to **Supabase** and **PostgreSQL**

### 💾 Database & Storage (Prisma + Supabase)

- **Prisma ORM** for structured database operations.
- **Supabase Storage** for handling:
  - Uploaded medical files and documents
  - Generated PDF reports
- Unified API access across both storage and database layers.

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, ShadCN UI
- **Backend:** Express.js (TypeScript), Prisma ORM
- **AI/ML:** OpenAI GPT-4o-mini
- **Database & Storage:** Supabase + PostgreSQL
- **Email Service:** Resend
- **PDF Generation:** pdf-lib
- **Form Source:** Tally.so
- **Deployment:** Vercel (frontend), Railway (backend)

---

## Architecture & Project Structure

```text
injury-ai/
├─ frontend/
│  ├─ public/         # Static assets (logos, gifs, screenshots)
│  ├─ .env
│  ├─ .gitignore
│  └─ src/
│     ├─ app/         # App routes and entry points
│     ├─ lib/         # Utility libraries
│     ├─ fetcher/     # API fetcher functions
│     └─ utils/       # Helper functions
├─ backend/
│  ├─ prisma/         # Prisma schema & migrations
│  ├─ .env
│  ├─ .gitignore
│  ├─ app.js          # Express app setup
│  ├─ server.js       # Backend entry point
│  └─ src/
│     ├─ config/      # Env, keys, and setup
│     ├─ controllers/ # Core logic: tallyWebhook, aiService, emailService
│     ├─ lib/         # Reusable helpers
│     ├─ routes/      # Express routes
│     ├─ schemas/     # Validation (Zod)
│     ├─ services/    # PDF, email, AI integration logic
│     ├─ utils/       # Utilities (formatting, parsing, etc.)
│     └─ types/       # Shared types/interfaces
├─ README.md
```

---

## Getting Started

Follow these steps to run **InjuryAI** locally.

### Prerequisites

Make sure you have:

- Node.js (v18+)
- npm
- Supabase account & project
- PostgreSQL database (local or hosted)
- Resend API key
- OpenAI API key

### Clone the repository

```bash
git clone https://github.com/mohammed-adl/injury-ai.git
cd injury-ai
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configure environment variables

**Backend `.env`**

```bash
NODE_ENV=development
PORT=3001
ORIGIN=http://localhost:3000

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

DATABASE_URL=postgres://username:password@localhost:5432/injury_ai

OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
```

**Frontend `.env`**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Run the application

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

---

## Usage

1. Submit your case details using the live Tally form.
2. The backend receives your submission via webhook.
3. AI service generates an estimate, rationale, and similar cases.
4. System emails the user automatically with a PDF attached.
5. Lawyer dashboard updates in real time with the new submission.

---

## Future Improvements

- **Enhanced AI Analysis:** Add function calling for dynamic reasoning and data lookup.
- **Automated Scoring:** Use historical data to calculate more accurate settlement confidence scores.
- **Multi-user Dashboard:** Role-based authentication for lawyers and admins.
- **Notifications:** Real-time email/SMS alerts for new submissions.
- **Analytics:** Add graphs for average settlements, treatment costs, etc.
- **Tests:** Implement unit and e2e tests for backend and frontend flows.

---

## License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.
