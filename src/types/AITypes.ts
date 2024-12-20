import { FunctionType } from './FunctionTypes';

export interface AIValidationRules {
  maxCoefficient?: number;
  minCoefficient?: number;
  allowedTerms?: string[];
  difficultyConstraints?: {
    maxTerms?: number;
    allowDecimals?: boolean;
    allowNegatives?: boolean;
    complexityLevel?: 'basic' | 'intermediate' | 'advanced';
  };
}

export interface AIProblemBankOptions {
  usePregenerated: boolean;
  bankPath?: string;
  validationRequired: boolean;
}

export interface AITemplateOptions {
  enabled: boolean;
  validationRules?: AIValidationRules;
  problemBank?: AIProblemBankOptions;
}

export interface AIGeneratedProblem {
  functionType: FunctionType;
  difficulty: 'easy' | 'medium' | 'hard';
  coefficients: number[];
  expression: string;
  contextDescription?: string;
  metadata: {
    generated: Date;
    validated: boolean;
    validatedBy?: string;
    version: string;
  };
}

export interface AIServiceInterface {
  isEnabled(): boolean;
  generateProblem(functionType: FunctionType, difficulty: 'easy' | 'medium' | 'hard'): AIGeneratedProblem | null;
  validateProblem(problem: AIGeneratedProblem): boolean;
  loadFromProblemBank(functionType: FunctionType, difficulty: 'easy' | 'medium' | 'hard'): AIGeneratedProblem | null;
} 