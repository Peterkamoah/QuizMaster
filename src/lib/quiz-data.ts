import type { Question } from '@/lib/types';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswerIndex: 2,
    explanation: "Paris is the capital and most populous city of France. It is known for its art, fashion, gastronomy and culture.",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswerIndex: 1,
    explanation: "Mars is often called the 'Red Planet' because of its reddish appearance, which is caused by iron oxide (rust) on its surface.",
  },
  {
    id: 3,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswerIndex: 3,
    explanation: "The Pacific Ocean is the largest and deepest of the world's five oceans, covering more than one-third of the Earth's surface.",
  },
  {
    id: 4,
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
    correctAnswerIndex: 0,
    explanation: "Harper Lee, an American novelist, wrote the Pulitzer Prize-winning novel 'To Kill a Mockingbird', published in 1960.",
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Au", "Pb", "Fe"],
    correctAnswerIndex: 1,
    explanation: "The chemical symbol for gold is Au, which comes from the Latin word 'aurum', meaning 'shining dawn'.",
  },
  {
    id: 6,
    question: "In what year did the Titanic sink?",
    options: ["1905", "1912", "1918", "1923"],
    correctAnswerIndex: 1,
    explanation: "The RMS Titanic sank in the early morning hours of April 15, 1912, in the North Atlantic Ocean after striking an iceberg.",
  },
  {
    id: 7,
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswerIndex: 2,
    explanation: "Diamond is the hardest known natural substance, rating a 10 on the Mohs scale of hardness.",
  },
  {
    id: 8,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    correctAnswerIndex: 2,
    explanation: "The Mona Lisa was painted by the Italian Renaissance artist Leonardo da Vinci and is one of the world's most famous works of art.",
  },
  {
    id: 9,
    question: "Which country is home to the kangaroo?",
    options: ["South Africa", "India", "Australia", "Brazil"],
    correctAnswerIndex: 2,
    explanation: "Kangaroos are marsupials that are native to the continent of Australia.",
  },
  {
    id: 10,
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion", "Lime"],
    correctAnswerIndex: 1,
    explanation: "The primary ingredient for guacamole is avocado, a tree-like fruit native to south-central Mexico.",
  },
];
