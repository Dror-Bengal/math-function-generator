export enum FunctionType {
  LINEAR = 'linear',
  QUADRATIC = 'quadratic',
  CUBIC = 'cubic',
  QUARTIC = 'quartic',
  POLYNOMIAL = 'polynomial',
  RATIONAL = 'rational',
  CIRCLE = 'circle',
  TRIGONOMETRIC = 'trigonometric',
  UNKNOWN = 'unknown'
}

export type FunctionTypeString = `${FunctionType}`;

export interface FunctionData {
  expression: string;
  points: number[];
  type: FunctionType;
  characteristics?: FunctionCharacteristics | GeometricCharacteristics;
  func?: (x: number) => number;
}

// Add a specific interface for rational functions
export interface RationalFunctionData extends Omit<FunctionData, 'points' | 'type'> {
  type: FunctionType.RATIONAL;
  numerator: number[];   // coefficients of numerator polynomial
  denominator: number[]; // coefficients of denominator polynomial
  func: (x: number) => number;
}

// Add asymptotes for rational functions
export interface Asymptotes {
  vertical: number[];   // x values for vertical asymptotes
  horizontal?: number;  // y value for horizontal asymptote
  oblique?: {          // for oblique (slant) asymptotes
    slope: number;
    intercept: number;
  };
}

// Base interface with common properties
export interface BaseFunctionCharacteristics {
  domain: string | [number, number];
  range: string | [number, number];
  criticalPoints: Point[];
  type?: FunctionTypeString;
  showAxes?: boolean;
  requireSketch?: boolean;
}

// Legacy interface (keep for backward compatibility)
export interface FunctionCharacteristics {
  domain: string | [number, number];
  range: string | [number, number];
  roots: Point[];
  criticalPoints: Point[];
  inflectionPoints?: Point[];
  yIntercept: number;
  asymptotes?: Asymptotes;
  period?: number;
  tangentLines?: Array<{ point: Point; slope: number }>;
  type?: FunctionTypeString;
  intervals?: {
    increasing: string[];
    decreasing: string[];
  };
  areaInfo?: {
    between: [number, number];
    value: number;
  };
  showAxes?: boolean;
  requireSketch?: boolean;
}

// New specific interfaces
export interface LinearFunctionCharacteristics extends BaseFunctionCharacteristics {
  roots: Point[];          // Keep for backward compatibility
  yIntercept: number;      // Keep for backward compatibility
  intersectionPoints: Point[]; // New consolidated property
  slope: number;
  signIntervals?: {
    positive: string[];    // Intervals where f(x) > 0
    negative: string[];    // Intervals where f(x) < 0
    zero: Point[];         // Points where f(x) = 0
  };
}

export interface QuadraticFunctionCharacteristics extends BaseFunctionCharacteristics {
  roots: Point[];
  vertex: Point;
  yIntercept: number;
  areaInfo?: AreaInfo;
  intersectionPoints?: Point[];
}

export interface RationalFunctionCharacteristics extends BaseFunctionCharacteristics {
  asymptotes: Asymptotes;
  holes?: Point[];
  intersectionPoints?: Point[];
}

export interface TrigonometricFunctionCharacteristics extends BaseFunctionCharacteristics {
  period: number;
  amplitude: number;
  phaseShift?: number;
  verticalShift?: number;
  intersectionPoints?: Point[];
}

export interface Point {
  x: number;
  y: number;
}

export interface GeneratedFunction {
  expression: string;
  coefficients: number[];
  type: "linear" | "quadratic" | "cubic" | "quartic";
  characteristics: FunctionCharacteristics;
  latex?: string;  // LaTeX representation if needed
}

// Add circle-specific interface
export interface CircleData extends Omit<FunctionData, 'type'> {
  type: FunctionType.CIRCLE;
  center: Point;
  radius: number;
  equation: string;
  intersectionPoints?: Point[];
  tangentPoints?: Point[];
}

// Add geometric characteristics
export interface GeometricCharacteristics extends FunctionCharacteristics {
  center?: Point;
  radius?: number;
  area?: number;
  perimeter?: number;
  tangentLines?: {
    point: Point;
    slope: number;
  }[];
  intersections?: {
    with: 'line' | 'circle';
    points: Point[];
  }[];
}

// Add these interfaces that were previously in App.tsx
export interface QuestionType {
  name: string;
  generator: () => FunctionData;
}

export interface DifficultyLevel {
  types: QuestionType[];
  investigations: string[];
}

// Add a specific interface for trigonometric functions
export interface TrigonometricFunctionData extends Omit<FunctionData, 'type'> {
  type: FunctionType.TRIGONOMETRIC;
  amplitude: number;
  period: number;
  phase?: number;
  verticalShift?: number;
}

export interface Intervals {
  increasing: string[];
  decreasing: string[];
}

export interface AreaInfo {
  between: [number, number];
  value: number;
}