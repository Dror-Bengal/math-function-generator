import { AIGeneratedProblem, AITemplateOptions, AIServiceInterface } from '../types/AITypes';
import { FunctionType } from '../types/FunctionTypes';
import { defaultAIOptions, functionTypeConstraints } from '../config/aiConfig';

export class AIService implements AIServiceInterface {
  private options: AITemplateOptions;

  constructor(options: Partial<AITemplateOptions> = {}) {
    this.options = { ...defaultAIOptions, ...options };
  }

  public isEnabled(): boolean {
    return this.options.enabled;
  }

  public generateProblem(
    _functionType: FunctionType,
    _difficulty: 'easy' | 'medium' | 'hard'
  ): AIGeneratedProblem | null {
    if (!this.isEnabled()) {
      return null;
    }

    // This is a placeholder for future AI integration
    // When enabled, this will make API calls to ChatGPT
    // For now, it returns null to maintain current functionality
    return null;
  }

  public validateProblem(problem: AIGeneratedProblem): boolean {
    if (!this.options.validationRules) {
      return true;
    }

    const constraints = functionTypeConstraints[problem.functionType];
    
    // Basic validation
    const validCoefficients = problem.coefficients.every(coeff => 
      coeff >= (constraints.minCoefficient ?? -Infinity) &&
      coeff <= (constraints.maxCoefficient ?? Infinity)
    );

    const validComplexity = 
      !constraints.difficultyConstraints?.maxTerms ||
      problem.coefficients.length <= constraints.difficultyConstraints.maxTerms;

    return validCoefficients && validComplexity;
  }

  public loadFromProblemBank(
    _functionType: FunctionType,
    _difficulty: 'easy' | 'medium' | 'hard'
  ): AIGeneratedProblem | null {
    if (!this.options.problemBank?.usePregenerated) {
      return null;
    }

    // This is a placeholder for future problem bank integration
    // When enabled, this will load pre-validated problems from the bank
    return null;
  }
} 