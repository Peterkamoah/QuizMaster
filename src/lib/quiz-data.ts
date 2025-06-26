import type { Question } from '@/lib/types';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary function of the `useEffect` hook in React?",
    options: [
        "To perform side effects in function components",
        "To declare state variables",
        "To create context for state management",
        "To handle user events"
    ],
    correctAnswerIndex: 0,
    explanation: "`useEffect` is used for side effects like data fetching, subscriptions, or manually changing the DOM. It runs after every render by default, or you can control when it runs with its dependency array.",
  },
  {
    id: 2,
    question: "Which of the following is NOT a core concept of Redux?",
    options: ["Store", "Actions", "Reducers", "Components"],
    correctAnswerIndex: 3,
    explanation: "While Redux is used with components (like in React), 'Components' are not a part of the core Redux architecture itself. The core concepts are a single 'Store', 'Actions' that describe what happened, and 'Reducers' that specify how the state changes in response to actions.",
  },
  {
    id: 3,
    question: "What is the result of the Pythagorean theorem for a right triangle with sides a=3 and b=4? The formula is $a^2 + b^2 = c^2$.",
    options: ["$c = 5$", "$c = 6$", "$c = 7$", "$c = 25$"],
    correctAnswerIndex: 0,
    explanation: "Using the formula $a^2 + b^2 = c^2$, we get $3^2 + 4^2 = c^2$, which simplifies to $9 + 16 = c^2$, so $25 = c^2$. Taking the square root of both sides gives $c = 5$.",
  },
  {
    id: 4,
    question: "In CSS, which property is used to change the background color of an element?",
    options: ["`color`", "`bgcolor`", "`background-color`", "`background`"],
    correctAnswerIndex: 2,
    explanation: "The `background-color` property specifically sets the background color. The `background` property is a shorthand that can set multiple background properties at once (color, image, position, etc.). `color` sets the text color.",
  },
  {
    id: 5,
    question: "What does the 'CSS' in CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswerIndex: 1,
    explanation: "CSS stands for Cascading Style Sheets. 'Cascading' refers to the way styles are applied based on a hierarchy of specificity and rule order.",
  },
  {
    id: 6,
    question: "What is the derivative of $f(x) = x^3 - 6x + 2$?",
    options: ["$3x^2 - 6$", "$x^2 - 6$", "$3x^2$", "$\frac{x^4}{4} - 3x^2 + 2x$"],
    correctAnswerIndex: 0,
    explanation: "Using the power rule for derivatives, the derivative of $x^n$ is $nx^{n-1}$. So, the derivative of $x^3$ is $3x^2$, the derivative of $-6x$ is $-6$, and the derivative of the constant $2$ is $0$. Combining these gives $3x^2 - 6$.",
  },
  {
    id: 7,
    question: "Which HTML tag is used to define an unordered list?",
    options: ["`<ol>`", "`<li>`", "<ul>", "`<list>`"],
    correctAnswerIndex: 2,
    explanation: "The `<ul>` tag is used to create an unordered (bulleted) list. The `<ol>` tag creates an ordered (numbered) list, and the `<li>` tag is used for each list item inside both `<ul>` and `<ol>`.",
  },
  {
    id: 8,
    question: "What will `console.log(typeof null);` output in JavaScript?",
    options: ["`null`", "`undefined`", "`object`", "`string`"],
    correctAnswerIndex: 2,
    explanation: "This is a well-known quirk in JavaScript. Due to historical reasons, the `typeof` operator returns 'object' for `null`. This is considered a bug that has not been fixed to avoid breaking existing code.",
  },
  {
    id: 9,
    question: "What is the purpose of the `alt` attribute on an `<img>` tag?",
    options: ["To provide alternative text for an image if it cannot be displayed.", "To set the alignment of the image.", "To add a tooltip to the image.", "To link the image to another page."],
    correctAnswerIndex: 0,
    explanation: "The `alt` attribute provides alternative text that is displayed if the image fails to load. It's also crucial for accessibility, as screen readers use it to describe the image to visually impaired users.",
  },
  {
    id: 10,
    question: "What is the Euler's identity, often considered the most beautiful equation in mathematics?",
    options: ["$e^{i\pi} + 1 = 0$", "$E = mc^2$", "$a^2 + b^2 = c^2$", "$\\sin^2(x) + \\cos^2(x) = 1$"],
    correctAnswerIndex: 0,
    explanation: "Euler's identity is $e^{i\\pi} + 1 = 0$. It remarkably links five of the most fundamental constants in mathematics: $e$ (Euler's number), $i$ (the imaginary unit), $\\pi$ (pi), $1$, and $0$.",
  },
];
