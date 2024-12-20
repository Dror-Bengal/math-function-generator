import { FunctionType, Point, QuadraticFunctionCharacteristics, AreaInfo } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

export const quadraticTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.quadratic,
      generator: () => {
        const a = (Math.random() > 0.5 ? 1 : -1);  // Keep it simple with ±1
        const b = Math.floor(Math.random() * 7) - 3;  // -3 to 3
        const c = Math.floor(Math.random() * 7) - 3;  // -3 to 3
        
        // Calculate vertex
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;
        const vertex: Point = { x: vertexX, y: vertexY };
        
        // Calculate roots using quadratic formula
        const discriminant = b * b - 4 * a * c;
        const roots: Point[] = [];
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          roots.push({ x: x1, y: 0 }, { x: x2, y: 0 });
        } else if (discriminant === 0) {
          roots.push({ x: -b / (2 * a), y: 0 });
        }

        // Calculate all intersection points (including y-intercept)
        const intersectionPoints: Point[] = [
          { x: 0, y: c },  // y-intercept
          ...roots         // x-intercepts (if any)
        ];

        // Calculate area between roots if they exist
        let areaInfo: AreaInfo | undefined;
        if (roots.length === 2) {
          const [x1, x2] = roots.map(p => p.x).sort((a, b) => a - b);
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

        const characteristics: QuadraticFunctionCharacteristics = {
          domain: "ℝ",
          range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`,
          intersectionPoints,
          criticalPoints: [vertex],
          type: FunctionType.QUADRATIC,
          vertex,
          roots,
          yIntercept: c,
          areaInfo
        };

        return {
          expression: `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
          points: [a, b, c],
          type: FunctionType.QUADRATIC,
          characteristics
        };
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.quadratic,
      generator: () => {
        const a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);  // ±1 or ±2
        const b = Math.floor(Math.random() * 9) - 4;  // -4 to 4
        const c = Math.floor(Math.random() * 9) - 4;  // -4 to 4
        
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;
        const vertex: Point = { x: vertexX, y: vertexY };
        
        const discriminant = b * b - 4 * a * c;
        const roots: Point[] = [];
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          roots.push({ x: x1, y: 0 }, { x: x2, y: 0 });
        } else if (discriminant === 0) {
          roots.push({ x: -b / (2 * a), y: 0 });
        }

        const intersectionPoints: Point[] = [
          { x: 0, y: c },
          ...roots
        ];

        let areaInfo: AreaInfo | undefined;
        if (roots.length === 2) {
          const [x1, x2] = roots.map(p => p.x).sort((a, b) => a - b);
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

        const characteristics: QuadraticFunctionCharacteristics = {
          domain: "ℝ",
          range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`,
          intersectionPoints,
          criticalPoints: [vertex],
          type: FunctionType.QUADRATIC,
          vertex,
          roots,
          yIntercept: c,
          areaInfo
        };

        return {
          expression: `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
          points: [a, b, c],
          type: FunctionType.QUADRATIC,
          characteristics
        };
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.quadratic,
      generator: () => {
        const a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);  // ±1, ±2, or ±3
        const b = Math.floor(Math.random() * 11) - 5;  // -5 to 5
        const c = Math.floor(Math.random() * 11) - 5;  // -5 to 5
        
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;
        const vertex: Point = { x: vertexX, y: vertexY };
        
        const discriminant = b * b - 4 * a * c;
        const roots: Point[] = [];
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          roots.push({ x: x1, y: 0 }, { x: x2, y: 0 });
        } else if (discriminant === 0) {
          roots.push({ x: -b / (2 * a), y: 0 });
        }

        const intersectionPoints: Point[] = [
          { x: 0, y: c },
          ...roots
        ];

        let areaInfo: AreaInfo | undefined;
        if (roots.length === 2) {
          const [x1, x2] = roots.map(p => p.x).sort((a, b) => a - b);
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

        const characteristics: QuadraticFunctionCharacteristics = {
          domain: "ℝ",
          range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`,
          intersectionPoints,
          criticalPoints: [vertex],
          type: FunctionType.QUADRATIC,
          vertex,
          roots,
          yIntercept: c,
          areaInfo
        };

        return {
          expression: `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
          points: [a, b, c],
          type: FunctionType.QUADRATIC,
          characteristics
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 