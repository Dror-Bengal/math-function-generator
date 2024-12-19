import { GeneratedFunction, Point, FunctionCharacteristics } from '../types/FunctionTypes';

export class FunctionGenerator {
  static readonly CONFIG = {
    linear: {
      easy: {
        slopeRange: [-2, 2],
        yInterceptRange: [-3, 3],
        wholeNumbers: true
      },
      medium: {
        slopeRange: [-3, 3],
        yInterceptRange: [-5, 5],
        wholeNumbers: false
      },
      hard: {
        slopeRange: [-5, 5],
        yInterceptRange: [-8, 8],
        wholeNumbers: false
      }
    },
    quadratic: {
      easy: {
        rootSpread: [-3, 3],
        vertexYRange: [-4, 4],
        wholeNumbers: true
      },
      medium: {
        rootSpread: [-4, 4],
        vertexYRange: [-6, 6],
        wholeNumbers: false
      },
      hard: {
        rootSpread: [-5, 5],
        vertexYRange: [-8, 8],
        wholeNumbers: false
      }
    }
  };

  static generateFunction(type: string, difficulty: string): GeneratedFunction {
    switch(type) {
      case 'linear':
        return this.generateLinearFunction(difficulty);
      case 'quadratic':
        return this.generateQuadraticFunction(difficulty);
      default:
        throw new Error(`Unsupported function type: ${type}`);
    }
  }

  private static generateLinearFunction(difficulty: 'easy' | 'medium' | 'hard'): GeneratedFunction {
    const config = this.CONFIG.linear[difficulty];
    
    // Generate slope and y-intercept
    const slope = this.generateNumber(config.slopeRange[0], config.slopeRange[1], config.wholeNumbers);
    const yIntercept = this.generateNumber(config.yInterceptRange[0], config.yInterceptRange[1], config.wholeNumbers);
    
    // Calculate x-intercept
    const xIntercept = -yIntercept / slope;
    
    const characteristics: FunctionCharacteristics = {
      roots: [{ x: xIntercept, y: 0 }],
      criticalPoints: [],
      yIntercept: yIntercept,
      domain: [-10, 10],
      range: [-10, 10],
      isIncreasing: [slope > 0],
      isDecreasing: [slope < 0]
    };

    return {
      expression: this.formatLinearExpression(slope, yIntercept),
      coefficients: [slope, yIntercept],
      type: "linear",
      characteristics
    };
  }

  private static generateQuadraticFunction(difficulty: 'easy' | 'medium' | 'hard'): GeneratedFunction {
    const config = this.CONFIG.quadratic[difficulty];
    
    // Generate vertex
    const vertexX = this.generateNumber(-2, 2, config.wholeNumbers);
    const vertexY = this.generateNumber(config.vertexYRange[0], config.vertexYRange[1], config.wholeNumbers);
    
    // Generate a (coefficient of x²)
    const a = vertexY < 0 ? 1 : -1;  // Make function open upward if vertex is below x-axis
    
    // Calculate coefficients from vertex form: a(x-h)² + k
    const h = vertexX;
    const k = vertexY;
    
    // Convert to standard form: ax² + bx + c
    const b = -2 * a * h;
    const c = a * h * h + k;

    // Calculate roots using quadratic formula
    const roots = this.calculateQuadraticRoots(a, b, c);
    
    const characteristics: FunctionCharacteristics = {
      roots,
      criticalPoints: [{ x: vertexX, y: vertexY }],
      yIntercept: c,
      domain: [-10, 10],
      range: a > 0 ? [vertexY, Infinity] : [-Infinity, vertexY]
    };

    return {
      expression: this.formatQuadraticExpression(a, b, c),
      coefficients: [a, b, c],
      type: "quadratic",
      characteristics
    };
  }

  private static generateNumber(min: number, max: number, wholeNumbers: boolean): number {
    let num = Math.random() * (max - min) + min;
    return wholeNumbers ? Math.round(num) : Number(num.toFixed(1));
  }

  private static formatLinearExpression(slope: number, yIntercept: number): string {
    const slopeStr = slope === 1 ? '' : slope === -1 ? '-' : slope;
    const yInterceptStr = yIntercept >= 0 ? `+ ${yIntercept}` : `- ${Math.abs(yIntercept)}`;
    return `f(x) = ${slopeStr}x ${yInterceptStr}`;
  }

  private static formatQuadraticExpression(a: number, b: number, c: number): string {
    const aStr = a === 1 ? '' : a === -1 ? '-' : a;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    return `f(x) = ${aStr}x² ${bStr}x ${cStr}`;
  }

  private static calculateQuadraticRoots(a: number, b: number, c: number): Point[] {
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return [];
    
    if (discriminant === 0) {
      const x = -b / (2 * a);
      return [{ x, y: 0 }];
    }
    
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [{ x: x1, y: 0 }, { x: x2, y: 0 }];
  }
} 