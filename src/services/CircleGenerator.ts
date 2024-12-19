import { CircleData, GeometricCharacteristics, Point } from '../types/FunctionTypes';

export class CircleGenerator {
  static generate(difficulty: 'easy' | 'medium' | 'hard'): CircleData {
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

  private static generateEasy(): CircleData {
    // Generate circle with center at origin
    const radius = Math.floor(Math.random() * 3) + 2; // radius between 2-4
    
    return {
      type: 'circle',
      center: { x: 0, y: 0 },
      radius,
      equation: `x² + y² = ${radius * radius}`,
      expression: `x² + y² = ${radius * radius}`,
      points: [radius],
      func: (x: number) => Math.sqrt(radius * radius - x * x), // Upper half of circle
      characteristics: this.generateCharacteristics({ x: 0, y: 0 }, radius)
    };
  }

  private static generateMedium(): CircleData {
    // Generate circle with integer center coordinates
    const center = {
      x: Math.floor(Math.random() * 5) - 2,
      y: Math.floor(Math.random() * 5) - 2
    };
    const radius = Math.floor(Math.random() * 3) + 2;
    
    return {
      type: 'circle',
      center,
      radius,
      equation: `(x ${center.x !== 0 ? `- ${center.x}` : ''})² + (y ${center.y !== 0 ? `- ${center.y}` : ''})² = ${radius * radius}`,
      expression: `(x ${center.x !== 0 ? `- ${center.x}` : ''})² + (y ${center.y !== 0 ? `- ${center.y}` : ''})² = ${radius * radius}`,
      points: [center.x, center.y, radius],
      func: (x: number) => center.y + Math.sqrt(radius * radius - Math.pow(x - center.x, 2)),
      characteristics: this.generateCharacteristics(center, radius)
    };
  }

  private static generateHard(): CircleData {
    // Generate circle with intersection points and tangent lines
    const center = {
      x: Math.floor(Math.random() * 7) - 3,
      y: Math.floor(Math.random() * 7) - 3
    };
    const radius = Math.floor(Math.random() * 4) + 2;
    
    // Generate some intersection points with a line
    const intersectionPoints = this.generateIntersectionPoints(center, radius);
    
    return {
      type: 'circle',
      center,
      radius,
      equation: `(x ${center.x !== 0 ? `- ${center.x}` : ''})² + (y ${center.y !== 0 ? `- ${center.y}` : ''})² = ${radius * radius}`,
      expression: `(x ${center.x !== 0 ? `- ${center.x}` : ''})² + (y ${center.y !== 0 ? `- ${center.y}` : ''})² = ${radius * radius}`,
      points: [center.x, center.y, radius],
      func: (x: number) => center.y + Math.sqrt(radius * radius - Math.pow(x - center.x, 2)),
      characteristics: this.generateCharacteristics(center, radius),
      intersectionPoints
    };
  }

  private static generateCharacteristics(center: Point, radius: number): GeometricCharacteristics {
    return {
      center,
      radius,
      area: Math.PI * radius * radius,
      perimeter: 2 * Math.PI * radius,
      domain: [center.x - radius, center.x + radius],
      range: [center.y - radius, center.y + radius],
      yIntercept: Math.sqrt(radius * radius - center.x * center.x) + center.y,
      roots: this.findRoots(center, radius),
      criticalPoints: [
        { x: center.x, y: center.y + radius }, // Top point
        { x: center.x, y: center.y - radius }  // Bottom point
      ]
    };
  }

  private static findRoots(center: Point, radius: number): Point[] {
    const roots: Point[] = [];
    const x1 = center.x - radius;
    const x2 = center.x + radius;
    
    if (Math.abs(x1) <= radius) roots.push({ x: x1, y: 0 });
    if (Math.abs(x2) <= radius) roots.push({ x: x2, y: 0 });
    
    return roots;
  }

  private static generateIntersectionPoints(center: Point, radius: number): Point[] {
    // Generate random line and find intersection points
    const slope = Math.random() * 4 - 2;
    const yIntercept = Math.random() * 4 - 2;
    
    // Quadratic formula to find intersection points
    const a = 1 + slope * slope;
    const b = 2 * slope * (yIntercept - center.y) - 2 * center.x;
    const c = center.x * center.x + (yIntercept - center.y) * (yIntercept - center.y) - radius * radius;
    
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return [];
    
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    
    return [
      { x: x1, y: slope * x1 + yIntercept },
      { x: x2, y: slope * x2 + yIntercept }
    ];
  }
} 