import { FunctionType, Point } from '../../types/FunctionTypes';
import { DifficultyLevel } from '../types';
import { translations } from '../translations';
import { hebrewInvestigations } from '../investigations';

export const circleTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [{
      name: translations.circle,
      generator: () => {
        const h = 0;  // center x-coordinate
        const k = 0;  // center y-coordinate
        const r = Math.floor(Math.random() * 3) + 2;  // radius

        return {
          expression: `(x - ${h})² + (y - ${k})² = ${r}²`,
          points: [h, k, r],
          type: FunctionType.CIRCLE,
          characteristics: {
            center: { x: h, y: k },
            radius: r,
            domain: `[${h - r}, ${h + r}]`,
            range: `[${k - r}, ${k + r}]`,
            area: Math.PI * r * r,
            circumference: 2 * Math.PI * r,
            roots: [],
            criticalPoints: [],
            yIntercept: k
          }
        };
      }
    }],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [{
      name: translations.circle,
      generator: () => {
        const h = Math.floor(Math.random() * 6) - 3;  // center x-coordinate
        const k = Math.floor(Math.random() * 6) - 3;  // center y-coordinate
        const r = Math.floor(Math.random() * 3) + 2;  // radius

        // Calculate intersection points with axes
        const xIntersections: Point[] = [];
        const yIntersections: Point[] = [];

        // X-axis intersections (y = 0)
        if (Math.abs(k) <= r) {
          const dx = Math.sqrt(r * r - k * k);
          xIntersections.push({ x: h - dx, y: 0 });
          xIntersections.push({ x: h + dx, y: 0 });
        }

        // Y-axis intersections (x = 0)
        if (Math.abs(h) <= r) {
          const dy = Math.sqrt(r * r - h * h);
          yIntersections.push({ x: 0, y: k - dy });
          yIntersections.push({ x: 0, y: k + dy });
        }

        return {
          expression: `(x - ${h})² + (y - ${k})² = ${r}²`,
          points: [h, k, r],
          type: FunctionType.CIRCLE,
          characteristics: {
            center: { x: h, y: k },
            radius: r,
            domain: `[${h - r}, ${h + r}]`,
            range: `[${k - r}, ${k + r}]`,
            area: Math.PI * r * r,
            circumference: 2 * Math.PI * r,
            xIntersections,
            yIntersections,
            roots: [],
            criticalPoints: [],
            yIntercept: k
          }
        };
      }
    }],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [{
      name: translations.circle,
      generator: () => {
        const h = Math.floor(Math.random() * 8) - 4;  // center x-coordinate
        const k = Math.floor(Math.random() * 8) - 4;  // center y-coordinate
        const r = Math.floor(Math.random() * 4) + 2;  // radius

        // Calculate intersection points with axes
        const xIntersections: Point[] = [];
        const yIntersections: Point[] = [];

        if (Math.abs(k) <= r) {
          const dx = Math.sqrt(r * r - k * k);
          xIntersections.push({ x: h - dx, y: 0 });
          xIntersections.push({ x: h + dx, y: 0 });
        }

        if (Math.abs(h) <= r) {
          const dy = Math.sqrt(r * r - h * h);
          yIntersections.push({ x: 0, y: k - dy });
          yIntersections.push({ x: 0, y: k + dy });
        }

        // Calculate quadrants the circle passes through
        const quadrants = new Set<number>();
        const corners: Point[] = [
          { x: h + r, y: k + r },  // top right
          { x: h - r, y: k + r },  // top left
          { x: h - r, y: k - r },  // bottom left
          { x: h + r, y: k - r }   // bottom right
        ];

        corners.forEach(point => {
          if (point.x >= 0 && point.y >= 0) quadrants.add(1);
          if (point.x <= 0 && point.y >= 0) quadrants.add(2);
          if (point.x <= 0 && point.y <= 0) quadrants.add(3);
          if (point.x >= 0 && point.y <= 0) quadrants.add(4);
        });

        return {
          expression: `(x - ${h})² + (y - ${k})² = ${r}²`,
          points: [h, k, r],
          type: FunctionType.CIRCLE,
          characteristics: {
            center: { x: h, y: k },
            radius: r,
            domain: `[${h - r}, ${h + r}]`,
            range: `[${k - r}, ${k + r}]`,
            area: Math.PI * r * r,
            circumference: 2 * Math.PI * r,
            xIntersections,
            yIntersections,
            quadrants: Array.from(quadrants).sort(),
            roots: [],
            criticalPoints: [],
            yIntercept: k
          }
        };
      }
    }],
    investigations: hebrewInvestigations.hard
  }
}; 