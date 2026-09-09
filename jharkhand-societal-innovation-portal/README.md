# Jharkhand Societal Innovation Collaboration Portal

A complete real-time web-based prototype connecting Citizens, Academic Institutions, Research Centers, Industry, and Government Departments.

## Quickstart Instructions

### 1. Execute Build Script
```bash
node build-project.js
```

### 2. Install Dependencies
```bash
cd jharkhand-societal-innovation-portal
npm install
```

### 3. Setup Supabase
1. Open the **SQL Editor** in your Supabase dashboard.
2. Copy and run the contents of `supabase/schema.sql`.
3. Enable Realtime on tables in **Database -> Realtime**.

### 4. Set Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Launch Development Server
```bash
npm run dev
```
