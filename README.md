# QuizMaster

**A modern, AI-powered quiz platform for personalized learning.**

QuizMaster allows users to generate custom quizzes from text or PDF documents, providing a dynamic and interactive way to study and test their knowledge.

## ✨ Core Features

*   **AI-Powered Quiz Generation**: Create quizzes from pasted text or by uploading a PDF document.
*   **Customizable Quizzes**:
    *   Set the difficulty level (Easy, Medium, Hard).
    *   Choose the number of questions.
    *   Enable or disable a timer and set a custom duration.
*   **Interactive Quiz Interface**:
    *   Clean and responsive design for answering questions.
    *   Navigate between questions.
    *   Flag questions for later review.
*   **Dynamic Navigation Panel**: Visually track your progress with clear states for answered, unanswered, visited, and flagged questions.
*   **Timed Quizzes**: An optional timer tracks time remaining and automatically submits the quiz when time runs out.
*   **In-Depth Results & Review**:
    *   Get an instant score summary upon completion.
    *   Review each question with your answer, the correct answer, and a detailed, AI-generated explanation.
*   **PDF Export**: Download your full quiz review, including questions, answers, and explanations, as a PDF for offline study.
*   **Light & Dark Mode**: A sleek, user-friendly theme that adapts to your preference.

## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **UI Library**: [React](https://reactjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
*   **AI/Generative**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **PDF Generation**: [jspdf](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)

## 🔧 Getting Started

Follow these instructions to get the project set up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the `.env` file.
    ```bash
    cp .env .env.local
    ```
    You will need a Google AI API key to use the quiz generation feature. Add it to your `.env.local` file:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```
    You can get a key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Development Server

The application requires two processes to run concurrently: the Next.js frontend and the Genkit AI flows.

1.  **Start the Genkit development service:**
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit flows and watch for any changes you make to them.

2.  **Start the Next.js application:**
    Open a second terminal and run:
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:9002`.

## 📂 Project Structure

The project is organized to separate concerns and make navigation intuitive.

```
.
├── src
│   ├── ai/                # Genkit AI configuration and flows
│   │   ├── flows/         # Contains the core quiz generation logic
│   │   └── genkit.ts      # Genkit initialization
│   ├── app/               # Next.js App Router pages and layouts
│   ├── components/        # Reusable React components
│   │   ├── quiz/          # Components specific to the quiz functionality
│   │   └── ui/            # ShadCN UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions, types, and static data
│   └── ...
├── public/                # Static assets (images, fonts, etc.)
└── ...
```
