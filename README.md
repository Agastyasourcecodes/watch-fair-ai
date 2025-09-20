Watch Fair AI
AI-Powered Proctoring Dashboard
Watch Fair AI is an AI-powered proctoring dashboard designed to ensure the integrity of online exams. The application simulates real-time monitoring of students by tracking attention, detecting suspicious audio, and identifying potentially risky browser extensions. It provides proctors with a comprehensive, at-a-glance view of the exam session to quickly identify and address potential violations.

Live Demo
Experience a live demo of the dashboard here:
https://watch-fair-ai-ay84.vercel.app

Features
Video Monitoring: Tracks student attention and head movements to detect if they are looking away from the screen. It also identifies multiple faces, which could indicate the presence of another person.

Audio Monitoring: Simulates real-time audio analysis to detect unusual sounds such as typing, multiple voices, or phone alerts. An audio level visualizer provides a quick overview of the acoustic environment.

Extension Detection: Simulates a scan of the student's browser extensions to flag those with high-risk permissions.

Real-time Status: The dashboard displays an overall status—Safe, Warning, or Danger—based on a combination of the monitoring metrics.

Violation Logging: All suspicious activities are logged with a confidence score, providing proctors with a clear, timestamped record of events.

Tech Stack
This project is built with a modern web development stack designed for performance, scalability, and an excellent developer experience.

Framework: React with Vite

Language: TypeScript

Styling: Tailwind CSS with Shadcn UI for accessible and customizable components

Routing: React Router

State Management: React Query

Data Visualization: Recharts

Form Management: React Hook Form with Zod for validation

Getting Started
To run this project locally, follow these steps:

Clone the repository:

git clone [https://fair-ai-repo-link.git](https://fair-ai-repo-link.git)
cd watch-fair-ai

Install dependencies:

npm install

or use your preferred package manager (e.g., yarn, pnpm, bun).

Start the development server:

npm run dev

Open your browser and navigate to http://localhost:8080 to view the application.

Contribution
Contributions are welcome! If you have suggestions for improvements, please open an issue or submit a pull request. :)
