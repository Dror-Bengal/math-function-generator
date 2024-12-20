import { FunctionType, Point, AreaInfo } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

export const quadraticTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.quadratic,
      generator: () => {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 6) - 3;
        const c = Math.floor(Math.random() * 6) - 3;
        
        // Calculate vertex and other characteristics
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;
        const discriminant = b * b - 4 * a * c;
        
        let roots: Point[] = [];
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          roots = [{ x: x1, y: 0 }, { x: x2, y: 0 }];
        } else if (discriminant === 0) {
          roots = [{ x: -b / (2 * a), y: 0 }];
        }

        return {
          expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
          points: [a, b, c],
          type: FunctionType.QUADRATIC,
          characteristics: {
            domain: "ℝ",
            range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`,
            roots,
            criticalPoints: [{ x: vertexX, y: vertexY }],
            yIntercept: c
          }
        };
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.quadratic,
      generator: () => {
        const a = Math.floor(Math.random() * 4) - 2;
        const b = Math.floor(Math.random() * 8) - 4;
        const c = Math.floor(Math.random() * 8) - 4;
        
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;
        const discriminant = b * b - 4 * a * c;
        
        let roots: Point[] = [];
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          roots = [{ x: x1, y: 0 }, { x: x2, y: 0 }];
        } else if (discriminant === 0) {
          roots = [{ x: -b / (2 * a), y: 0 }];
        }

        return {
          expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
          points: [a, b, c],
          type: FunctionType.QUADRATIC,
          characteristics: {
            domain: "ℝ",
            range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`,
            roots,
            criticalPoints: [{ x: vertexX, y: vertexY }],
            yIntercept: c
          }
        };
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.quadratic,
      generator: () => {
        const a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        const b = Math.floor(Math.random() * 10) - 5;
        const c = Math.floor(Math.random() * 10) - 5;
        
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;
        const discriminant = b * b - 4 * a * c;
        
        let roots: Point[] = [];
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          roots = [{ x: x1, y: 0 }, { x: x2, y: 0 }];
        } else if (discriminant === 0) {
          roots = [{ x: -b / (2 * a), y: 0 }];
        }

        // Calculate area between roots if they exist
        let areaInfo: AreaInfo | undefined = undefined;
        if (roots.length === 2) {
          const x1 = roots[0].x;
          const x2 = roots[1].x;
          const area = Math.abs(
            (a/3) * (x2*x2*x2 - x1*x1*x1) +
            (b/2) * (x2*x2 - x1*x1) +
            c * (x2 - x1)
          );
          areaInfo = {
            between: [x1, x2],
            value: Number(area.toFixed(3))
          };
        }

        return {
          expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
          points: [a, b, c],
          type: FunctionType.QUADRATIC,
          characteristics: {
            domain: "ℝ",
            range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`,
            roots,
            criticalPoints: [{ x: vertexX, y: vertexY }],
            yIntercept: c,
            areaInfo
          }
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 