import { FunctionType, Point, Intervals } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

export const rationalTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.rational,
      generator: () => {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 4) - 2;
        const c = Math.floor(Math.random() * 4) - 2;
        const d = Math.floor(Math.random() * 3) + 1;

        // Calculate vertical asymptote
        const verticalAsymptote = -c / d;
        
        // Calculate horizontal asymptote
        const horizontalAsymptote = a / d;

        // Calculate critical points
        const criticalPoints: Point[] = [];
        const numeratorRoot = -b / a;
        if (numeratorRoot !== verticalAsymptote) {
          const y = (a * numeratorRoot + b) / (d * numeratorRoot + c);
          criticalPoints.push({ x: numeratorRoot, y });
        }

        return {
          expression: `f(x) = (${a}x ${b >= 0 ? "+" : ""}${b})/(${d}x ${c >= 0 ? "+" : ""}${c})`,
          points: [a, b, c, d],
          type: FunctionType.RATIONAL,
          characteristics: {
            domain: `ℝ\\{${verticalAsymptote}}`,
            verticalAsymptote,
            horizontalAsymptote,
            criticalPoints,
            roots: [],
            yIntercept: b / c,
            range: `ℝ\\{${horizontalAsymptote}}`
          }
        };
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.rational,
      generator: () => {
        const a = Math.floor(Math.random() * 4) - 2;
        const b = Math.floor(Math.random() * 6) - 3;
        const c = Math.floor(Math.random() * 6) - 3;
        const d = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);

        const verticalAsymptote = -c / d;
        const horizontalAsymptote = a / d;

        const criticalPoints: Point[] = [];
        const numeratorRoot = -b / a;
        if (numeratorRoot !== verticalAsymptote) {
          const y = (a * numeratorRoot + b) / (d * numeratorRoot + c);
          criticalPoints.push({ x: numeratorRoot, y });
        }

        // Calculate holes in the graph
        const holes: Point[] = [];
        if (numeratorRoot === verticalAsymptote) {
          const limit = (a * (numeratorRoot + 0.0001) + b) / (d * (numeratorRoot + 0.0001) + c);
          holes.push({ x: numeratorRoot, y: limit });
        }

        return {
          expression: `f(x) = (${a}x ${b >= 0 ? "+" : ""}${b})/(${d}x ${c >= 0 ? "+" : ""}${c})`,
          points: [a, b, c, d],
          type: FunctionType.RATIONAL,
          characteristics: {
            domain: `ℝ\\{${verticalAsymptote}}`,
            verticalAsymptote,
            horizontalAsymptote,
            criticalPoints,
            holes,
            roots: [],
            yIntercept: b / c,
            range: `ℝ\\{${horizontalAsymptote}}`
          }
        };
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.rational,
      generator: () => {
        const a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
        const b = Math.floor(Math.random() * 8) - 4;
        const c = Math.floor(Math.random() * 8) - 4;
        const d = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);

        const verticalAsymptote = -c / d;
        const horizontalAsymptote = a / d;

        const criticalPoints: Point[] = [];
        const numeratorRoot = -b / a;
        if (numeratorRoot !== verticalAsymptote) {
          const y = (a * numeratorRoot + b) / (d * numeratorRoot + c);
          criticalPoints.push({ x: numeratorRoot, y });
        }

        const holes: Point[] = [];
        if (numeratorRoot === verticalAsymptote) {
          const limit = (a * (numeratorRoot + 0.0001) + b) / (d * (numeratorRoot + 0.0001) + c);
          holes.push({ x: numeratorRoot, y: limit });
        }

        // Calculate intervals of increase/decrease
        const intervals: Intervals = {
          increasing: [],
          decreasing: []
        };

        // Derivative is (ad*x + bc)/(dx + c)^2
        // Sign changes at x = -bc/(ad) if ad ≠ 0
        if (a * d !== 0) {
          const criticalX = -(b * c) / (a * d);
          if (criticalX !== verticalAsymptote) {
            if (a * d > 0) {
              intervals.increasing.push(`(-∞, ${verticalAsymptote})`);
              intervals.increasing.push(`(${verticalAsymptote}, ∞)`);
            } else {
              intervals.decreasing.push(`(-∞, ${verticalAsymptote})`);
              intervals.decreasing.push(`(${verticalAsymptote}, ∞)`);
            }
          }
        }

        return {
          expression: `f(x) = (${a}x ${b >= 0 ? "+" : ""}${b})/(${d}x ${c >= 0 ? "+" : ""}${c})`,
          points: [a, b, c, d],
          type: FunctionType.RATIONAL,
          characteristics: {
            domain: `ℝ\\{${verticalAsymptote}}`,
            verticalAsymptote,
            horizontalAsymptote,
            criticalPoints,
            holes,
            intervals,
            roots: [],
            yIntercept: b / c,
            range: `ℝ\\{${horizontalAsymptote}}`
          }
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 