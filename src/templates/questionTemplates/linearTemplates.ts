import { FunctionType } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

export const linearTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.linear,
      generator: () => {
        const m = Math.floor(Math.random() * 7) - 3;  // slope: -3 to 3
        const b = Math.floor(Math.random() * 11) - 5; // y-intercept: -5 to 5
        return {
          expression: `f(x) = ${m}x ${b >= 0 ? "+" : ""}${b}`,
          points: [m, b],
          type: FunctionType.LINEAR,
          characteristics: {
            domain: "ℝ",
            range: "ℝ",
            roots: [{x: -b/m, y: 0}],
            criticalPoints: [],
            yIntercept: b
          }
        };
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
        return {
          expression: `f(x) = ${m % 1 === 0 ? m : `${m.toFixed(1)}`}x ${b >= 0 ? "+" : ""}${b}`,
          points: [m, b],
          type: FunctionType.LINEAR,
          characteristics: {
            domain: "ℝ",
            range: "ℝ",
            roots: [{x: -b/m, y: 0}],
            criticalPoints: [],
            yIntercept: b
          }
        };
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
        return {
          expression: `f(x) = ${m % 1 === 0 ? m : m.toFixed(2)}x ${b >= 0 ? "+" : ""}${b % 1 === 0 ? b : b.toFixed(1)}`,
          points: [m, b],
          type: FunctionType.LINEAR,
          characteristics: {
            domain: "ℝ",
            range: "ℝ",
            roots: [{x: -b/m, y: 0}],
            criticalPoints: [],
            yIntercept: b
          }
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 