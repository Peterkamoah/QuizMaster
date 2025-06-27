# QuizMaster: The AI-Powered Quiz Platform

## 📜 Project Overview

QuizMaster is a modern, AI-powered quiz application designed to make learning more interactive and efficient. It allows users to instantly generate custom quizzes from their own study materials—whether it's pasted text or a full PDF document. This tool is perfect for students who want to test their knowledge, educators looking to create quick assessments, and anyone passionate about lifelong learning.

### ✨ Key Features

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

## 📸 Demo / Screenshots

<p align="center">
  <img src="https://placehold.co/800x450.png" alt="QuizMaster Demo" data-ai-hint="app screenshot" />
</p>

## ⚙️ Installation

Follow these instructions to get the project set up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later is recommended)
- [npm](https://www.npmjs.com/)

### Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file.
    ```bash
    cp .env .env.local
    ```
    You will need a Google AI API key to use the quiz generation feature. Add it to your `.env.local` file:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```
    You can get a free key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Run the development servers:**
    The application requires two processes to run concurrently: the Next.js frontend and the Genkit AI service.

    *   **In your first terminal, start the Genkit service:**
        ```bash
        npm run genkit:watch
        ```

    *   **In a second terminal, start the Next.js application:**
        ```bash
        npm run dev
        ```

    The application should now be available at `http://localhost:9002`.

## 🚀 Usage

Once the application is running, you can start creating quizzes right away:

1.  **Configure Quiz Options**: Use the setup card to select the desired difficulty, number of questions, and timer duration.
2.  **Provide Context**:
    *   **From Text**: Paste any text content into the text area and click "Generate Quiz".
    *   **From PDF**: Upload a PDF document and click "Generate Quiz from PDF".
3.  **Take the Quiz**: Answer the questions, navigate using the side panel or next/previous buttons, and flag questions for review.
4.  **Review Results**: After submitting, view your score summary and then proceed to the detailed review page to see explanations for each question.
5.  **Download Review**: From the review page, you can download a full PDF of the quiz and your results for offline study.

## 🛠️ Technologies Used

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **UI Library**: [React](https://reactjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
-   **AI/Generative**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **PDF Generation**: [jspdf](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
-   **State Management**: React Hooks (`useState`, `useEffect`)

## ©️ Copyright

Copyright (c) 2024 [PAM](https://peter-s-digital-stage-portfolio.vercel.app/)
