interface Question {
  content: string;
  options: [
    {
      numbering: number;
      answer: string;
    },
  ];
  correctAnswer: number;
}
