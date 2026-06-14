# Monolith

Monolith is an intelligent marketing analytics application that leverages the power of Google's Gemini 2.5 Flash to automatically generate target audience personas and strategic marketing insights directly from video content.

## Features

- **Video Analysis**: Upload marketing videos (or any media) for deep analysis.
- **AI-Powered Insights**: Uses Gemini 2.5 Flash to extract:
  - Target audience personas (including age, income level, and core motivators).
  - Audience fit and demographics.
  - Strategic campaign recommendations and messaging refinements.
- **Modern Tech Stack**: React frontend (Vite) and an Express (Node.js) backend utilizing the `@google/generative-ai` SDK.

## Project Structure

- `/src`: React frontend utilizing modern functional components.
- `/server`: Node.js/Express backend that handles file uploads (`multer`) and communicates with the Gemini API via the `GoogleAIFileManager` and `GoogleGenerativeAI`.

## Prerequisites

- Node.js (v18+ recommended)
- A Google Gemini API Key

## Setup & Installation

1. **Install frontend dependencies** (from the root directory):
   ```bash
   npm install
   ```
2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```
3. **Configure Environment Variables**:
   In the `server` directory, create a `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```
   *(Note: If `GEMINI_API_KEY` is not provided, the backend falls back to using mock insights data).*

## Running the Application

You will need to start both the backend server and the frontend development server.

**Start the Backend:**
```bash
cd server
npm start
```
The server will run on `http://localhost:3001`.

**Start the Frontend:**
Open a new terminal window at the project root and run:
```bash
npm run dev
```
The Vite development server will start, typically on `http://localhost:5173`.
