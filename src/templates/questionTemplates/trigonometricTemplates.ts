import { FunctionType, Point, Intervals } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

export const trigonometricTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.trigonometric,
      generator: () => {
        const a = Math.floor(Math.random() * 2) + 1;  // amplitude
        const b = Math.floor(Math.random() * 2) + 1;  // frequency
        const c = 0;  // phase shift
        const d = 0;  // vertical shift

        // Calculate period
        const period = (2 * Math.PI) / b;

        // Calculate critical points (maxima and minima)
        const criticalPoints: Point[] = [
          { x: -Math.PI / (2 * b), y: -a },  // minimum
          { x: Math.PI / (2 * b), y: a }     // maximum
        ];

        return {
          expression: `f(x) = ${a}sin(${b}x)`,
          points: [a, b, c, d],
          type: FunctionType.TRIGONOMETRIC,
          characteristics: {
            domain: "ℝ",
            range: `[${-a}, ${a}]`,
            period,
            amplitude: a,
            criticalPoints,
            roots: [
              { x: 0, y: 0 },
              { x: Math.PI / b, y: 0 }
            ],
            yIntercept: 0
          }
        };
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.trigonometric,
      generator: () => {
        const a = Math.floor(Math.random() * 3) + 1;  // amplitude
        const b = Math.floor(Math.random() * 3) + 1;  // frequency
        const c = Math.floor(Math.random() * 4) - 2;  // phase shift
        const d = 0;  // vertical shift

        const period = (2 * Math.PI) / b;
        
        // Calculate critical points with phase shift
        const criticalPoints: Point[] = [
          { x: -Math.PI / (2 * b) - c/b, y: -a },  // minimum
          { x: Math.PI / (2 * b) - c/b, y: a }     // maximum
        ];

        return {
          expression: `f(x) = ${a}sin(${b}x ${c >= 0 ? "+" : ""}${c})`,
          points: [a, b, c, d],
          type: FunctionType.TRIGONOMETRIC,
          characteristics: {
            domain: "ℝ",
            range: `[${-a}, ${a}]`,
            period,
            amplitude: a,
            phaseShift: -c/b,
            criticalPoints,
            roots: [
              { x: -c/b, y: 0 },
              { x: Math.PI/b - c/b, y: 0 }
            ],
            yIntercept: a * Math.sin(c)
          }
        };
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.trigonometric,
      generator: () => {
        const a = Math.floor(Math.random() * 4) + 1;  // amplitude
        const b = Math.floor(Math.random() * 4) + 1;  // frequency
        const c = Math.floor(Math.random() * 6) - 3;  // phase shift
        const d = Math.floor(Math.random() * 4) - 2;  // vertical shift

        const period = (2 * Math.PI) / b;
        
        // Calculate critical points with both phase and vertical shifts
        const criticalPoints: Point[] = [
          { x: -Math.PI / (2 * b) - c/b, y: -a + d },  // minimum
          { x: Math.PI / (2 * b) - c/b, y: a + d }     // maximum
        ];

        // Calculate intervals of increase/decrease
        const intervals: Intervals = {
          increasing: [],
          decreasing: []
        };

        // One complete cycle of intervals
        const cycleStart = -c/b;
        intervals.increasing.push(
          `[${cycleStart}, ${cycleStart + Math.PI/b}]`
        );
        intervals.decreasing.push(
          `[${cycleStart + Math.PI/b}, ${cycleStart + 2*Math.PI/b}]`
        );

        return {
          expression: `f(x) = ${a}sin(${b}x ${c >= 0 ? "+" : ""}${c}) ${d >= 0 ? "+" : ""}${d}`,
          points: [a, b, c, d],
          type: FunctionType.TRIGONOMETRIC,
          characteristics: {
            domain: "ℝ",
            range: `[${-a + d}, ${a + d}]`,
            period,
            amplitude: a,
            phaseShift: -c/b,
            verticalShift: d,
            criticalPoints,
            intervals,
            roots: [
              { x: -c/b, y: d },
              { x: Math.PI/b - c/b, y: d }
            ],
            yIntercept: a * Math.sin(c) + d
          }
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 