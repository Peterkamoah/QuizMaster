# QuizMaster: The AI-Powered Quiz Platform

[![Build Status](https://img.shields.io/travis/com/peterkamoah/quizmaster.svg?style=flat-square)](https://travis-ci.com/peterkamoah/quizmaster)
[![Code Coverage](https://img.shields.io/coveralls/github/peterkamoah/quizmaster.svg?style=flat-square)](https://coveralls.io/github/peterkamoah/quizmaster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/github/contributors/peterkamoah/quizmaster.svg?style=flat-square)](https://github.com/peterkamoah/quizmaster/graphs/contributors)

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

*(Here you can add a GIF or screenshots of the application in action.)*

<p align="center">
  <img src="https://placehold.co/800x450.png" alt="QuizMaster Demo" data-ai-hint="app screenshot" />
</p>

## 📚 Table of Contents

- [QuizMaster: The AI-Powered Quiz Platform](#quizmaster-the-ai-powered-quiz-platform)
  - [📜 Project Overview](#-project-overview)
    - [✨ Key Features](#-key-features)
  - [📸 Demo / Screenshots](#-demo--screenshots)
  - [📚 Table of Contents](#-table-of-contents)
  - [⚙️ Installation](#️-installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [🚀 Usage](#-usage)
  - [🛠️ Technologies Used](#️-technologies-used)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [©️ Copyright](#️-copyright)
  - [📫 Contact](#-contact)

## ⚙️ Installation

Follow these instructions to get the project set up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later is recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/peterkamoah/quizmaster.git
    cd quizmaster
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file.
    ```bash
    cp .env .env.local
    ```
    You will need a Google AI API key to use the quiz generation feature. Add it to your `.env.local` file:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```
    You can get a free key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development servers:**
    The application requires two processes to run concurrently: the Next.js frontend and the Genkit AI service.

    *   **In your first terminal, start the Genkit service:**
        ```bash
        npm run genkit:watch
        ```
        This command starts the Genkit flows and watches for any changes you make to them.

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

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) file for more detailed contribution guidelines.

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for more information. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.

## ©️ Copyright

Copyright (c) 2024 [PAM](https://peter-s-digital-stage-portfolio.vercel.app/)

## 📫 Contact

Peter Amoah Mensah - [Portfolio](https://peter-s-digital-stage-portfolio.vercel.app/) | [@peterkamoah](https://github.com/peterkamoah)

Project Link: [https://github.com/peterkamoah/quizmaster](https://github.com/peterkamoah/quizmaster)
