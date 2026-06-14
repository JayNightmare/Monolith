# Project Memory

## Current State
- The project "Monolith" is a React (Vite) frontend and Node.js/Express backend application.
- It provides a workflow to upload marketing videos, analyze them with Google's Gemini 2.5 Flash, and display target audience personas and strategic insights.
- The UI includes an Upload page, a Processing page, an Insights view, and a static Pricing page.
- The backend handles file uploads via `multer`, temporarily stores them in memory (`jobs` object), and interacts with the Gemini API to retrieve structured JSON insights. Fallback mock data is used if no API key is provided.

## Active Tasks
### Completed
- Basic routing and UI shell (`Layout`, `UploadPage`, `ProcessingPage`, `InsightsPage`, `PricingPage`).
- **Landing Page**: Implemented the root `/` Landing Page using the provided Stitch template with brutalist aesthetics, linked the navbar logo to this landing page, and integrated snappy UI animations (pulse, slide-up fades).
- Express server structure with `/api/upload`, `/api/analyze/:id`, and `/api/insights/:id`.
- Gemini API integration with `GoogleAIFileManager` and `GoogleGenerativeAI`.
- **Database Persistence**: Integrated MongoDB/Mongoose to persist `Job` records.
- **Archive System**: Created `ArchivePage` and `/api/archive` endpoint to view past job history.
- **Image Generation**: Automated persona portrait generation using Pollinations.ai.
- **Reporting**: Added `jsPDF` and `html2canvas` for PDF export functionality.
- **Validation**: Enforced video MIME type checking on client and server.
- **User Accounts & Authentication**: Implemented JWT-based authentication, user registration, profile management, and isolated archives.
- **Account Tiers**: Enforced limits based on `free` (3 uploads max, basic insights/images) and `paid` (unlimited, high-fidelity images, strategic insights) account types.

### Next Steps for Implementation
- Enable Webhook callbacks from Gemini API processing instead of polling.
- Custom domain/branding integration.

## Architectural Decisions
- **Frontend**: React via Vite with modern functional components. Routing with `react-router-dom`.
- **Backend**: Node.js/Express.
- **Authentication**: JWT-based auth. Passwords hashed with `bcrypt`. Users have `free` or `paid` account tiers.
- **Database**: MongoDB (via Mongoose) to store jobs persistently, rather than in-memory.
- **AI Model**: Gemini 2.5 Flash for multimodal analysis, returning structured JSON.
- **Image Generation**: DiceBear (Initials or Micah) used for deterministic, prompt-based avatar generation based on tier (Pollinations.ai removed due to 403 errors).
- **File Storage (Temporary)**: Local disk storage via `multer` for upload before passing to Gemini API.
