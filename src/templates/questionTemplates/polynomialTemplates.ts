import { FunctionType, Point } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';
import { AIService } from '../../services/AIService';
import { defaultAIOptions } from '../../config/aiConfig';

const INFINITY = '∞';
const aiService = new AIService(defaultAIOptions);

function generatePolynomial(
  coefficients: number[] | null = null,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy'
) {
  // Use provided coefficients or generate new ones
  let a, b, c, d;
  if (coefficients && coefficients.length === 4) {
    [a, b, c, d] = coefficients;
  } else {
    a = Math.random() > 0.5 ? 1 : -1;
    b = Math.floor(Math.random() * 3) + 1;
    c = Math.floor(Math.random() * 3) + 1;
    d = Math.floor(Math.random() * 5) - 2;
  }

  // Find critical points using derivative
  const criticalPoints: Point[] = [];
  
  // Using quadratic formula to find critical points (only if they're simple)
  const discr = 4 * b * b - 12 * a * c;
  if (discr > 0) {
    const x1 = (-2 * b + Math.sqrt(discr)) / (6 * a);
    const x2 = (-2 * b - Math.sqrt(discr)) / (6 * a);
    // Only include if they're "nice" numbers
    if (Math.abs(x1) % 1 < 0.1 || Math.abs(x1) % 1 > 0.9) {
      criticalPoints.push({ 
        x: Math.round(x1), 
        y: a * Math.pow(Math.round(x1), 3) + b * Math.pow(Math.round(x1), 2) + c * Math.round(x1) + d 
      });
    }
    if (Math.abs(x2) % 1 < 0.1 || Math.abs(x2) % 1 > 0.9) {
      criticalPoints.push({ 
        x: Math.round(x2), 
        y: a * Math.pow(Math.round(x2), 3) + b * Math.pow(Math.round(x2), 2) + c * Math.round(x2) + d 
      });
    }
  }

  // Calculate areas of increase/decrease
  const increasingIntervals: string[] = [];
  const decreasingIntervals: string[] = [];
  if (criticalPoints.length > 0) {
    criticalPoints.sort((p1, p2) => p1.x - p2.x);
    if (a > 0) {
      decreasingIntervals.push(`(${criticalPoints[0].x}, ${criticalPoints[1]?.x || INFINITY})`);
      increasingIntervals.push(`(-∞, ${criticalPoints[0].x})`);
      if (criticalPoints[1]) {
        increasingIntervals.push(`(${criticalPoints[1].x}, ∞)`);
      }
    } else {
      increasingIntervals.push(`(${criticalPoints[0].x}, ${criticalPoints[1]?.x || INFINITY})`);
      decreasingIntervals.push(`(-∞, ${criticalPoints[0].x})`);
      if (criticalPoints[1]) {
        decreasingIntervals.push(`(${criticalPoints[1].x}, ∞)`);
      }
    }
  }

  // Find roots (only include simple ones)
  const roots: Point[] = [];
  // Add y-intercept as a potential root if it's 0
  if (d === 0) {
    roots.push({ x: 0, y: 0 });
  }

  const expression = `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x³ ${b === 1 ? '+' : b === -1 ? '-' : b > 0 ? `+${b}` : b}x² ${c === 1 ? '+' : c === -1 ? '-' : c > 0 ? `+${c}` : c}x ${d >= 0 ? '+' : ''}${d}`;

  return {
    expression,
    points: [a, b, c, d],
    type: FunctionType.POLYNOMIAL,
    characteristics: {
      domain: "ℝ",
      range: "ℝ",
      criticalPoints,
      yIntercept: d,
      increasingIntervals,
      decreasingIntervals,
      showAxes: true,
      requireSketch: Math.random() > (difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 0.6 : 0.5),
      roots
    }
  };
}

function tryGenerateWithAI(difficulty: 'easy' | 'medium' | 'hard'): ReturnType<typeof generatePolynomial> {
  const aiProblem = aiService.generateProblem(FunctionType.POLYNOMIAL, difficulty);
  if (aiProblem && aiService.validateProblem(aiProblem)) {
    return generatePolynomial(aiProblem.coefficients, difficulty);
  }
  return generatePolynomial(null, difficulty);
}

export const polynomialTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.polynomial,
      generator: () => tryGenerateWithAI('easy')
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.polynomial,
      generator: () => tryGenerateWithAI('medium')
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.polynomial,
      generator: () => tryGenerateWithAI('hard')
    }],
    investigations: hebrewInvestigations.hard
  }
}; 