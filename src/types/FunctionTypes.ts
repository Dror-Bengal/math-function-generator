import { ChangeEvent } from 'react';

export enum FunctionType {
  LINEAR = 'linear',
  QUADRATIC = 'quadratic',
  POLYNOMIAL = 'polynomial',
  RATIONAL = 'rational',
  TRIGONOMETRIC = 'trigonometric',
  CIRCLE = 'circle'
}

export interface FunctionData {
  expression: string;
  points: number[];
  type: "linear" | "quadratic" | "cubic" | "quartic" | "rational" | "circle" | "trigonometric";
  characteristics?: FunctionCharacteristics | GeometricCharacteristics;
  func?: (x: number) => number;
}

// Add a specific interface for rational functions
export interface RationalFunctionData extends Omit<FunctionData, 'points'> {
  type: 'rational';
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

export interface FunctionCharacteristics {
  roots: Point[];
  criticalPoints: Point[];
  inflectionPoints?: Point[];
  yIntercept: number;
  domain: string | [number, number]; // Allow string for rational function domains
  range: string | [number, number];  // Allow string for ranges like 'ℝ'
  asymptotes?: Asymptotes;          // Add asymptotes for rational functions
  period?: number;                  // For trigonometric functions
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

// Update FunctionTypeChangeEvent type
type FunctionTypeChangeEvent = ChangeEvent<HTMLSelectElement>; 

// Add circle-specific interface
export interface CircleData extends Omit<FunctionData, 'type'> {
  type: 'circle';
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
  type: 'trigonometric';
  amplitude: number;
  period: number;
  phase?: number;
  verticalShift?: number;
}