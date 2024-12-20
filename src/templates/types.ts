import { FunctionData } from '../types/FunctionTypes';

export interface QuestionType {
  name: string;
  generator: () => FunctionData;
}

export interface DifficultyLevel {
  types: QuestionType[];
  investigations: string[];
} 