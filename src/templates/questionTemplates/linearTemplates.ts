import { FunctionType, FunctionData, LinearFunctionCharacteristics, Point } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

// Helper function to generate linear function with given parameters
const generateLinearFunction = (
  m: number,  // slope
  b: number,  // y-intercept
  formatSlope: (m: number) => string = (m) => {
    if (m === 1) return 'x';
    if (m === -1) return '-x';
    return `${m}x`;
  },
  formatIntercept: (b: number) => string = (b) => `${b}`
): FunctionData => {
  // Calculate intersection points
  const intersectionPoints: Point[] = [
    { x: 0, y: b },  // y-intercept
    { x: -b/m, y: 0 }  // x-intercept (when y = 0)
  ];

  // Calculate sign intervals
  const xIntercept = -b/m;
  const signIntervals = {
    positive: [] as string[],
    negative: [] as string[],
    zero: [{ x: xIntercept, y: 0 }] as Point[]
  };

  if (m !== 0) {
    if (m > 0) {
      signIntervals.negative.push(`(-∞, ${xIntercept.toFixed(2)})`);
      signIntervals.positive.push(`(${xIntercept.toFixed(2)}, ∞)`);
    } else {
      signIntervals.positive.push(`(-∞, ${xIntercept.toFixed(2)})`);
      signIntervals.negative.push(`(${xIntercept.toFixed(2)}, ∞)`);
    }
  } else if (b > 0) {
    signIntervals.positive.push('(-∞, ∞)');
  } else if (b < 0) {
    signIntervals.negative.push('(-∞, ∞)');
  }

  const characteristics: LinearFunctionCharacteristics = {
    domain: "ℝ",
    range: "ℝ",
    roots: [{ x: xIntercept, y: 0 }],
    criticalPoints: [],
    yIntercept: b,
    intersectionPoints,
    slope: m,
    type: FunctionType.LINEAR,
    signIntervals
  };

  // Format the expression
  let expression = 'f(x) = ';
  expression += formatSlope(m);
  if (b !== 0) {
    expression += b > 0 ? ` + ${formatIntercept(b)}` : ` ${formatIntercept(b)}`;
  }

  return {
    expression,
    points: [m, b],
    type: FunctionType.LINEAR,
    characteristics
  };
};

export const linearTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.linear,
      generator: () => {
        const m = Math.floor(Math.random() * 7) - 3;  // slope: -3 to 3
        const b = Math.floor(Math.random() * 11) - 5; // y-intercept: -5 to 5
        return generateLinearFunction(m, b);
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.linear,
      generator: () => {
        const m = (Math.floor(Math.random() * 9) - 4) / 2; // fractional slopes
        const b = Math.floor(Math.random() * 13) - 6;      // y-intercept: -6 to 6
        return generateLinearFunction(
          m, 
          b,
          (m) => m % 1 === 0 ? `${m}` : `${m.toFixed(1)}`,
          (b) => `${b}`
        );
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.linear,
      generator: () => {
        const m = (Math.floor(Math.random() * 21) - 10) / 4; // complex fractions
        const b = (Math.floor(Math.random() * 21) - 10) / 2; // fractional y-intercepts
        return generateLinearFunction(
          m,
          b,
          (m) => m % 1 === 0 ? `${m}` : m.toFixed(2),
          (b) => b % 1 === 0 ? `${b}` : b.toFixed(1)
        );
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 