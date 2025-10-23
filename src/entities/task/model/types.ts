/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Step {
  Id: number;
  D1: number;
  D2: number;
  CarryIn: number;
  Sum: number;
  CarryOut: number;
  ParentHint?: string;
  Hint: string;
  Side: "left" | "right";
}

export interface Question {
  Steps: Step[];
  ResultDigitCount: number;
  MathOperation: number;
  Numbers: number[];
}

export interface QuestionData {
  questionId: number;
  studentQuestionId: number;
  questionText: string;
  motivationMessage: string | null;
  question: Question;
  steps: any | null;
  options: any | null;
  answerType: number;
  correctAnswer: any | null;
  backgroundImg: string;
  questionImgs: any | null;
  level: number;
  readable: boolean;
  questionReadText: string;
  hints: any[];
  backgroundImg2: string;
}

export type LeftRow = {
  id: number;
  value: number;
  usedCols: number;
  minus?: boolean;
  lineAbove?: boolean;
};

export type QuestionList = QuestionData[];
