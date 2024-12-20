import { FunctionType, Point } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

const INFINITY = '∞';

export const polynomialTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.polynomial,
      generator: () => {
        // Ensure coefficients are simple and non-zero
        const a = Math.random() > 0.5 ? 1 : -1;
        const b = Math.floor(Math.random() * 3) + 1;
        const c = Math.floor(Math.random() * 3) + 1;
        const d = Math.floor(Math.random() * 5) - 2;

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
            requireSketch: Math.random() > 0.7,
            roots
          }
        };
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.polynomial,
      generator: () => {
        // Similar improvements as easy level
        const a = Math.random() > 0.5 ? 1 : -1;
        const b = Math.floor(Math.random() * 4) + 1;
        const c = Math.floor(Math.random() * 4) + 1;
        const d = Math.floor(Math.random() * 6) - 3;

        const criticalPoints: Point[] = [];
        const roots: Point[] = [];
        
        const discr = 4 * b * b - 12 * a * c;
        if (discr > 0) {
          const x1 = (-2 * b + Math.sqrt(discr)) / (6 * a);
          const x2 = (-2 * b - Math.sqrt(discr)) / (6 * a);
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
            showAxes: true,
            requireSketch: Math.random() > 0.6,
            roots
          }
        };
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.polynomial,
      generator: () => {
        const a = Math.random() > 0.5 ? 1 : -1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        const d = Math.floor(Math.random() * 8) - 4;

        const criticalPoints: Point[] = [];
        const roots: Point[] = [];
        
        const discr = 4 * b * b - 12 * a * c;
        if (discr > 0) {
          const x1 = (-2 * b + Math.sqrt(discr)) / (6 * a);
          const x2 = (-2 * b - Math.sqrt(discr)) / (6 * a);
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

        if (d === 0) {
          roots.push({ x: 0, y: 0 });
        }

        // Calculate inflection point
        const inflectionX = -b / (3 * a);
        const inflectionY = a * Math.pow(inflectionX, 3) + b * Math.pow(inflectionX, 2) + c * inflectionX + d;

        // Calculate positive/negative intervals
        const positiveIntervals: string[] = [];
        const negativeIntervals: string[] = [];
        
        // Sort all critical points and roots for interval analysis
        const allPoints = [...criticalPoints, ...roots].sort((p1, p2) => p1.x - p2.x);
        
        // Evaluate function at midpoints between critical points to determine sign
        if (allPoints.length > 0) {
          let currentX = allPoints[0].x;
          
          for (let i = 0; i <= allPoints.length; i++) {
            const nextX = i < allPoints.length ? allPoints[i].x : currentX + 2;
            const midX = (currentX + nextX) / 2;
            const y = a * Math.pow(midX, 3) + b * Math.pow(midX, 2) + c * midX + d;
            
            const nextPoint = i < allPoints.length ? nextX : INFINITY;
            if (y > 0) {
              positiveIntervals.push(`(${currentX}, ${nextPoint})`);
            } else if (y < 0) {
              negativeIntervals.push(`(${currentX}, ${nextPoint})`);
            }
            
            currentX = nextX;
          }
        }

        // Generate area calculation questions for integrals
        const areaQuestions = [];
        if (criticalPoints.length >= 2) {
          // Area between two critical points
          const x1 = criticalPoints[0].x;
          const x2 = criticalPoints[1].x;
          areaQuestions.push({
            question: `חשב את השטח בין גרף הפונקציה לציר ה-x בתחום [${x1}, ${x2}]`,
            bounds: [x1, x2]
          });
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
            inflectionPoint: { x: inflectionX, y: inflectionY },
            yIntercept: d,
            showAxes: true,
            requireSketch: Math.random() > 0.5,
            roots,
            positiveIntervals,
            negativeIntervals,
            areaQuestions
          }
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 