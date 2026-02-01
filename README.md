# FNOL Pro - First Notice of Loss Management

FNOL Pro is a professional educational web application designed for insurance companies to digitize and standardize the **First Notice of Loss (FNOL)** process.

## Project Goal
Improve efficiency, traceability, and data quality in insurance claim reporting by moving from manual forms to a structured, multi-step digital experience.

## Features
- **Authentication**: Secure login and registration for clients and admins.
- **Multi-step FNOL Form**: 
  - Claim type selection (Auto, Home, Business).
  - Policyholder and Policy data verification.
  - Incident details and damage description.
- **Claim Management**:
  - Real-time status tracking (New, In Review, Closed).
  - Detailed activity logs for every claim.
- **Admin Dashboard**:
  - Global view of all claims.
  - Ability to update claim status and add internal notes.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI
- **ORM**: Prisma 7
- **Database**: SQLite (Development)
- **Auth**: NextAuth.js
- **Validation**: Zod

## How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Demo Credentials**:
   - **Admin**: `admin@fnolpro.com` / `admin123`
   - **Client**: `client@example.com` / `client123`

## What is FNOL?
**First Notice of Loss (FNOL)** is the first report made to an insurance provider following the loss, theft, or damage of an insured asset. In the insurance industry, FNOL is a critical touchpoint where speed and data accuracy directly impact customer satisfaction and claim processing costs.
