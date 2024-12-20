import { AITemplateOptions, AIValidationRules } from '../types/AITypes';
import { FunctionType } from '../types/FunctionTypes';

export const defaultAIOptions: AITemplateOptions = {
  enabled: false, // Disabled by default
  validationRules: {
    maxCoefficient: 10,
    minCoefficient: -10,
    allowedTerms: ['x', 'y'],
    difficultyConstraints: {
      maxTerms: 4,
      allowDecimals: false,
      allowNegatives: true,
      complexityLevel: 'basic'
    }
  },
  problemBank: {
    usePregenerated: false,
    bankPath: './problemBank',
    validationRequired: true
  }
};

const baseValidationRules: AIValidationRules = {
  maxCoefficient: 5,
  minCoefficient: -5,
  difficultyConstraints: {
    maxTerms: 3,
    allowDecimals: false,
    complexityLevel: 'basic'
  }
};

export const functionTypeConstraints: Record<FunctionType, AIValidationRules> = {
  [FunctionType.LINEAR]: {
    ...baseValidationRules,
    maxCoefficient: 10,
    minCoefficient: -10,
    difficultyConstraints: {
      maxTerms: 2,
      allowDecimals: false,
      complexityLevel: 'basic'
    }
  },
  [FunctionType.QUADRATIC]: {
    ...baseValidationRules,
    difficultyConstraints: {
      maxTerms: 3,
      allowDecimals: false,
      complexityLevel: 'basic'
    }
  },
  [FunctionType.POLYNOMIAL]: {
    ...baseValidationRules,
    maxCoefficient: 3,
    minCoefficient: -3,
    difficultyConstraints: {
      maxTerms: 4,
      allowDecimals: false,
      complexityLevel: 'intermediate'
    }
  },
  [FunctionType.RATIONAL]: {
    ...baseValidationRules,
    maxCoefficient: 3,
    minCoefficient: -3,
    difficultyConstraints: {
      maxTerms: 4,
      allowDecimals: false,
      complexityLevel: 'advanced'
    }
  },
  [FunctionType.CIRCLE]: {
    ...baseValidationRules,
    difficultyConstraints: {
      maxTerms: 3,
      allowDecimals: false,
      complexityLevel: 'intermediate'
    }
  },
  [FunctionType.CUBIC]: baseValidationRules,
  [FunctionType.QUARTIC]: baseValidationRules,
  [FunctionType.TRIGONOMETRIC]: baseValidationRules,
  [FunctionType.UNKNOWN]: baseValidationRules
}; 