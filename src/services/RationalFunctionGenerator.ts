import { FunctionCharacteristics, Point, RationalFunctionData } from '../types/FunctionTypes';

export class RationalFunctionGenerator {
  static generate(difficulty: 'easy' | 'medium' | 'hard'): RationalFunctionData {
    switch (difficulty) {
      case 'easy':
        return this.generateEasy();
      case 'medium':
        return this.generateMedium();
      case 'hard':
        return this.generateHard();
      default:
        return this.generateEasy();
    }
  }

  private static generateEasy(): RationalFunctionData {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    
    return {
      expression: `(x + ${a})/(x + ${b})`,
      type: 'rational',
      numerator: [1, a],
      denominator: [1, b],
      func: (x: number) => (x + a)/(x + b),
      characteristics: {
        domain: `x ≠ ${-b}`,
        range: 'ℝ',
        roots: this.findRoots(-a, b),
        criticalPoints: [],
        yIntercept: a/b,
        asymptotes: {
          vertical: [-b],
          horizontal: [1]
        }
      }
    };
  }

  private static generateMedium(): RationalFunctionData {
    const a = Math.floor(Math.random() * 5) - 2;
    const b = Math.floor(Math.random() * 5) - 2;
    const c = Math.floor(Math.random() * 5) + 1;
    
    return {
      expression: `(x² + ${a}x + ${b})/(x + ${c})`,
      type: 'rational',
      numerator: [1, a, b],
      denominator: [1, c],
      func: (x: number) => (x*x + a*x + b)/(x + c),
      characteristics: {
        domain: `x ≠ ${-c}`,
        range: 'ℝ',
        roots: this.findQuadraticRoots(1, a, b),
        criticalPoints: this.findCriticalPoints(a, b, c),
        yIntercept: b/c,
        asymptotes: {
          vertical: [-c],
          horizontal: [1],
          oblique: {
            slope: 1,
            intercept: a - c
          }
        }
      }
    };
  }

  private static generateHard(): RationalFunctionData {
    const a = Math.floor(Math.random() * 5) - 2;
    const b = Math.floor(Math.random() * 5) - 2;
    const c = Math.floor(Math.random() * 5) + 1;
    const d = Math.floor(Math.random() * 5) - 2;
    
    return {
      expression: `(x³ + ${a}x² + ${b}x + ${c})/(x + ${d})`,
      type: 'rational',
      numerator: [1, a, b, c],
      denominator: [1, d],
      func: (x: number) => (Math.pow(x, 3) + a*x*x + b*x + c)/(x + d),
      characteristics: {
        domain: `x ≠ ${-d}`,
        range: 'ℝ',
        roots: this.findCubicRoots(1, a, b, c),
        criticalPoints: this.findComplexCriticalPoints(a, b, c, d),
        yIntercept: c/d,
        asymptotes: {
          vertical: [-d],
          horizontal: undefined,
          oblique: {
            slope: 1,
            intercept: a - d
          }
        }
      }
    };
  }

  private static findRoots(numeratorRoot: number, denominatorRoot: number): Point[] {
    return [{
      x: -numeratorRoot,
      y: 0
    }];
  }

  private static findQuadraticRoots(a: number, b: number, c: number): Point[] {
    const discriminant = b*b - 4*a*c;
    if (discriminant < 0) return [];
    
    const x1 = (-b + Math.sqrt(discriminant))/(2*a);
    const x2 = (-b - Math.sqrt(discriminant))/(2*a);
    
    return [
      { x: x1, y: 0 },
      { x: x2, y: 0 }
    ];
  }

  private static findCriticalPoints(a: number, b: number, c: number): Point[] {
    const discriminant = a*a - 4*b*c;
    if (discriminant < 0) return [];
    
    const x1 = (-a + Math.sqrt(discriminant))/(2*c);
    const x2 = (-a - Math.sqrt(discriminant))/(2*c);
    
    return [
      { x: x1, y: 0 },
      { x: x2, y: 0 }
    ];
  }

  private static findComplexCriticalPoints(a: number, b: number, c: number, d: number): Point[] {
    const discriminant = a*a - 4*b*c;
    if (discriminant < 0) return [];
    
    const x1 = (-a + Math.sqrt(discriminant))/(2*c);
    const x2 = (-a - Math.sqrt(discriminant))/(2*c);
    
    return [
      { x: x1, y: 0 },
      { x: x2, y: 0 }
    ];
  }

  private static findCubicRoots(a: number, b: number, c: number, d: number): Point[] {
    const discriminant = b*b - 3*a*c;
    if (discriminant < 0) return [];
    
    const x1 = (-b + Math.sqrt(discriminant))/(3*a);
    const x2 = (-b - Math.sqrt(discriminant))/(3*a);
    
    return [
      { x: x1, y: 0 },
      { x: x2, y: 0 }
    ];
  }
} 