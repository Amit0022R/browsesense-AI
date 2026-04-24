# BrowseSense AI 🎯

BrowseSense AI is a full-stack, AI-powered productivity dashboard that transforms your raw Chrome history exports into actionable behavioral insights. Discover exactly where your time goes, get personalized coaching suggestions, and interact directly with your data through a conversational AI assistant.

![UI Dashboard](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.jpg) *(A modern, minimal SaaS dashboard built with React & Tailwind CSS v4)*

## ✨ Features

- **Smart Analysis:** Upload standard Chrome JSON history exports to instantly calculate your overall **Productivity Score**.
- **Time Breakdown:** Visual progress bars displaying your Productive vs. Distracting time.
- **AI Insights & Coaching:** Uses Groq API (`llama-3.3-70b-versatile`) to generate customized behavioral insights and actionable suggestions.
- **Interactive Chat:** Ask natural language questions about your browsing habits (e.g., *"Where did I waste most time?"*) and get instant answers based purely on your uploaded data.
- **Data Persistence:** Automatically saves your analysis results to MongoDB and displays a history of your "Recent Analyses".

## 🧱 Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS v4, Lucide React
- **Backend:** Node.js, Express, TypeScript, Zod (validation)
- **Database:** MongoDB Atlas & Mongoose
- **AI Integration:** Groq API SDK

---

## 🚀 Local Setup Instructions

Follow these steps to get the application running on your local machine.

### 1. Prerequisites
- Node.js installed
- A [Groq API Key](https://console.groq.com/) (Free)
- A [MongoDB Atlas](https://www.mongodb.com/atlas/database) account and cluster (Free)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/browsesense-ai.git
cd browsesense-ai
```

### 3. Server Setup (Backend)
Open a terminal window and navigate to the server folder:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your credentials:
```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
```

Start the backend server:
```bash
npm run dev
```
*You should see "Server is running on port 3000" and "MongoDB Connected" in the terminal.*

### 4. Client Setup (Frontend)
Open a **second** terminal window and navigate to the client folder:
```bash
cd client
npm install
```

Start the frontend Vite server:
```bash
npm run dev
```

### 5. Access the App
Open your browser and navigate to `http://localhost:5173`. 
Upload a JSON file (or click "Use sample data") and hit **Analyze**!

---

## 📦 Deployment Guide

To deploy this project to the web for free:

1. **Backend (Render.com):**
   - Connect your GitHub repo and select the `server` root directory.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Add your `.env` variables (`GROQ_API_KEY` and `MONGO_URI`).

2. **Frontend (Vercel):**
   - Connect your GitHub repo and select the `client` root directory.
   - Select "Vite" as the framework preset.
   - Add an Environment Variable named `VITE_API_URL` and paste your live Render backend URL.

---

> *"Your attention is your most valuable asset."*
