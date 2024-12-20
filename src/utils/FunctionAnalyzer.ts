import { FunctionCharacteristics, Point } from '../types/FunctionTypes';

export class FunctionAnalyzer {
  static analyzeFunction(coefficients: number[], type: string): FunctionCharacteristics {
    switch(type) {
      case 'linear':
        return this.analyzeLinear(coefficients);
      case 'quadratic':
        return this.analyzeQuadratic(coefficients);
      default:
        throw new Error(`Unsupported function type: ${type}`);
    }
  }

  static findIntervals(points: Point[]): string[] {
    if (points.length < 2) return [];
    
    const intervals: string[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      intervals.push(`[${points[i].x}, ${points[i + 1].x}]`);
    }
    return intervals;
  }

  private static analyzeLinear(coefficients: number[]): FunctionCharacteristics {
    const [m, b] = coefficients;
    return {
      roots: m !== 0 ? [{ x: -b/m, y: 0 }] : [],
      criticalPoints: [],
      yIntercept: b,
      domain: "ℝ",
      range: "ℝ"
    };
  }

  private static analyzeQuadratic(coefficients: number[]): FunctionCharacteristics {
    const [a, b, c] = coefficients;
    const discriminant = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    
    const roots: Point[] = [];
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      roots.push({ x: x1, y: 0 }, { x: x2, y: 0 });
    } else if (discriminant === 0) {
      roots.push({ x: vertexX, y: 0 });
    }

    return {
      roots,
      criticalPoints: [{ x: vertexX, y: vertexY }],
      yIntercept: c,
      domain: "ℝ",
      range: a > 0 ? `[${vertexY}, ∞)` : `(-∞, ${vertexY}]`
    };
  }

  static analyzeFunctionCharacteristics(
    func: (x: number) => number,
    expression: string
  ): FunctionCharacteristics {
    console.log(`Analyzing function: ${expression}`);
    const roots = this.findRoots(func);
    const criticalPoints = this.findCriticalPoints(func);
    const yIntercept = func(0);

    return {
      roots,
      criticalPoints,
      yIntercept,
      domain: "ℝ",
      range: "ℝ"
    };
  }

  static findRoots(
    func: (x: number) => number,
    start = -10,
    end = 10,
    step = 0.1
  ): Point[] {
    const roots: Point[] = [];
    for (let x = start; x <= end; x += step) {
      const y = func(x);
      if (Math.abs(y) < 0.001) {
        roots.push({ x, y: 0 });
      }
    }
    return roots;
  }

  static findCriticalPoints(
    func: (x: number) => number,
    start = -10,
    end = 10,
    step = 0.1
  ): Point[] {
    const criticalPoints: Point[] = [];
    let lastY = func(start);
    
    for (let x = start + step; x <= end; x += step) {
      const y = func(x);
      const prevSlope = (y - lastY) / step;
      const nextY = func(x + step);
      const nextSlope = (nextY - y) / step;
      
      if (Math.abs(prevSlope) < 0.001 || (prevSlope * nextSlope < 0)) {
        criticalPoints.push({ x, y });
      }
      
      lastY = y;
    }
    
    return criticalPoints;
  }
} 