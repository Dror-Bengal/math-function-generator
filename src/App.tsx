import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import { GraphVisualizer } from './services/GraphVisualizer';
import { 
  FunctionType, 
  FunctionData, 
  CircleData,
  DifficultyLevel 
} from './types/FunctionTypes';
import { CircleGenerator } from './services/CircleGenerator';

// Update translations with corrected Hebrew text
const translations = {
  easy: 'קל',
  medium: 'בינוני',
  hard: 'מתקדם',
  polynomial: 'פולינום',
  rational: 'פונקציה רציונלית',
  trigonometric: 'פונקציה טריגונומטרית',
  linear: 'פונקציה לינארית',
  quadratic: 'פונקציה ריבועית',
  generate: 'צור פונקציה חדשה',
  title: 'חקר פונקציות אינטראקטיבי',
  subtitle: 'כלי מתקדם לתרגול וחקירת פונקציות מתמטיות',
  functionType: 'סוג הפונקציה',
  investigationSteps: 'שלבי החקירה',
  difficultyLevel: 'רמת קושי',
  functionDisplay: 'הפונקציה הנתונה',
  graphTitle: 'גרף הפונקציה',
  circle: 'מעגל',
};

// Update the investigations to Hebrew
const hebrewInvestigations = {
  easy: [
    "מצא את תחום ההגדרה של הפונקציה",
    "מצא את נקודות החיתוך עם הצירים",
    "מצא את נקודת החיתוך עם ציר ה-y",
    "האם הפונקציה עולה או יורדת?"
  ],
  medium: [
    "מצא את תחום ההגדרה של הפונקציה",
    "מצא את כל נקודות החיתוך עם הצירים",
    "מצא נקודות קיצון מקומיות",
    "קבע תחומי עליה וירידה",
    "חקור התנהגות בקצוות"
  ],
  hard: [
    "מצא את תחום ההגדרה של הפונקציה",
    "מצא את כל נקודות החיתוך עם הצירים",
    "מצא נקודות קיצון מקומיות",
    "מצא נקודות פיתול",
    "קבע תחומי קעירות כלפי מעלה/מטה",
    "חקור התנהגות בקצוות",
    "שרטט גרף מפורט המציג את כל התכונות"
  ]
};

// Update the FunctionTypes interface to support all function types
interface FunctionTypes {
  [FunctionType.LINEAR]: Record<'easy' | 'medium' | 'hard', DifficultyLevel>;
  [FunctionType.QUADRATIC]: Record<'easy' | 'medium' | 'hard', DifficultyLevel>;
  [FunctionType.POLYNOMIAL]: Record<'easy' | 'medium' | 'hard', DifficultyLevel>;
  [FunctionType.RATIONAL]: Record<'easy' | 'medium' | 'hard', DifficultyLevel>;
  [FunctionType.TRIGONOMETRIC]: Record<'easy' | 'medium' | 'hard', DifficultyLevel>;
  [FunctionType.CIRCLE]: Record<'easy' | 'medium' | 'hard', DifficultyLevel>;
}

interface Question {
  type: FunctionType;
  function: FunctionData | CircleData;
  investigations: string[];
}

// First, define the polynomial templates separately
const polynomialTemplates: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: {
    types: [
      {
        name: "Quadratic",
        generator: () => {
          const a = Math.floor(Math.random() * 3) + 1;
          const b = Math.floor(Math.random() * 6) - 3;
          const c = Math.floor(Math.random() * 6) - 3;
          return {
            expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
            points: [a, b, c],
            type: "quadratic",
          };
        },
      }
    ],
    investigations: hebrewInvestigations.easy
  },
  medium: {
    types: [
      {
        name: "Cubic",
        generator: () => {
          const a = Math.floor(Math.random() * 2) + 1;
          const b = Math.floor(Math.random() * 6) - 3;
          const c = Math.floor(Math.random() * 6) - 3;
          const d = Math.floor(Math.random() * 6) - 3;
          return {
            expression: `f(x) = ${a}x³ ${b >= 0 ? "+" : ""}${b}x² ${c >= 0 ? "+" : ""}${c}x ${d >= 0 ? "+" : ""}${d}`,
            points: [a, b, c, d],
            type: "cubic",
          };
        },
      }
    ],
    investigations: hebrewInvestigations.medium
  },
  hard: {
    types: [
      {
        name: "Quartic",
        generator: () => {
          const coeffs = Array(5).fill(0).map(() => Math.floor(Math.random() * 4) - 2);
          return {
            expression: `f(x) = ${coeffs[0]}x⁴ ${coeffs[1] >= 0 ? "+" : ""}${coeffs[1]}x³ ${coeffs[2] >= 0 ? "+" : ""}${coeffs[2]}x² ${coeffs[3] >= 0 ? "+" : ""}${coeffs[3]}x ${coeffs[4] >= 0 ? "+" : ""}${coeffs[4]}`,
            points: coeffs,
            type: "quartic",
          };
        },
      }
    ],
    investigations: hebrewInvestigations.hard
  }
};

// Then update the questionTemplates
const questionTemplates: FunctionTypes = {
  [FunctionType.LINEAR]: {
    easy: {
      types: [{
        name: translations.linear,
        generator: () => {
          const m = Math.floor(Math.random() * 7) - 3;  // slope: -3 to 3
          const b = Math.floor(Math.random() * 11) - 5; // y-intercept: -5 to 5
          return {
            expression: `f(x) = ${m}x ${b >= 0 ? "+" : ""}${b}`,
            points: [m, b],
            type: "linear",
            characteristics: {
              domain: "ℝ",
              range: "ℝ",
              roots: [{x: -b/m, y: 0}],
              criticalPoints: [],
              yIntercept: b
            }
          };
        }
      }],
      investigations: hebrewInvestigations.easy
    },
    medium: {
      types: [{
        name: translations.linear,
        generator: () => {
          const m = (Math.floor(Math.random() * 9) - 4) / 2; // fractional slopes: -2 to 2 in 0.5 steps
          const b = Math.floor(Math.random() * 13) - 6;      // y-intercept: -6 to 6
          return {
            expression: `f(x) = ${m % 1 === 0 ? m : `${m.toFixed(1)}`}x ${b >= 0 ? "+" : ""}${b}`,
            points: [m, b],
            type: "linear",
            characteristics: {
              domain: "ℝ",
              range: "ℝ",
              roots: [{x: -b/m, y: 0}],
              criticalPoints: [],
              yIntercept: b
            }
          };
        }
      }],
      investigations: hebrewInvestigations.medium
    },
    hard: {
      types: [{
        name: translations.linear,
        generator: () => {
          const m = (Math.floor(Math.random() * 21) - 10) / 4; // more complex fractions: -2.5 to 2.5 in 0.25 steps
          const b = (Math.floor(Math.random() * 21) - 10) / 2; // fractional y-intercepts: -5 to 5 in 0.5 steps
          return {
            expression: `f(x) = ${m % 1 === 0 ? m : m.toFixed(2)}x ${b >= 0 ? "+" : ""}${b % 1 === 0 ? b : b.toFixed(1)}`,
            points: [m, b],
            type: "linear",
            characteristics: {
              domain: "ℝ",
              range: "ℝ",
              roots: [{x: -b/m, y: 0}],
              criticalPoints: [],
              yIntercept: b
            }
          };
        }
      }],
      investigations: hebrewInvestigations.hard
    }
  },
  [FunctionType.QUADRATIC]: {
    easy: {
      types: [{
        name: translations.quadratic,
        generator: () => {
          const a = Math.floor(Math.random() * 3) + 1;
          const b = Math.floor(Math.random() * 6) - 3;
          const c = Math.floor(Math.random() * 6) - 3;
          return {
            expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
            points: [a, b, c],
            type: "quadratic",
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
          return {
            expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
            points: [a, b, c],
            type: "quadratic",
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
          return {
            expression: `f(x) = ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c}`,
            points: [a, b, c],
            type: "quadratic",
          };
        }
      }],
      investigations: hebrewInvestigations.hard
    }
  },
  [FunctionType.POLYNOMIAL]: polynomialTemplates,
  [FunctionType.RATIONAL]: {
    easy: {
      types: [{
        name: translations.rational,
        generator: () => {
          // Simple rational function (x+a)/(x+b)
          const a = Math.floor(Math.random() * 6) - 3;
          const b = Math.floor(Math.random() * 6) - 3;
          return {
            expression: `f(x) = (x ${a >= 0 ? "+" : ""}${a})/(x ${b >= 0 ? "+" : ""}${b})`,
            points: [1, a, 1, b], // [num coeff, num const, den coeff, den const]
            type: "rational",
            characteristics: {
              domain: `x ≠ ${-b}`,
              range: "ℝ\\{1}",
              roots: [{x: -a, y: 0}],
              criticalPoints: [],
              yIntercept: a/b
            }
          };
        }
      }],
      investigations: [
        "מצא את תחום ההגדרה של הפונקציה",
        "מצא את האסימפטוטות האנכיות",
        "מצא את האסימפטוטה האופקית",
        "מצא את נקודות החיתוך עם הצירים"
      ]
    },
    medium: {
      types: [{
        name: translations.rational,
        generator: () => {
          // Ensure denominator is never zero by avoiding d = 0
          const a = Math.floor(Math.random() * 3) + 1;
          const b = Math.floor(Math.random() * 6) - 3;
          const c = Math.floor(Math.random() * 6) - 3;
          const d = (Math.floor(Math.random() * 5) - 2) || 1; // If 0, use 1 instead
          return {
            expression: `f(x) = (${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c})/(x ${d >= 0 ? "+" : ""}${d})`,
            points: [a, b, c, 1, d],
            type: "rational",
            characteristics: {
              domain: `x ≠ ${-d}`,
              range: "ℝ",
              roots: [],
              criticalPoints: [],
              yIntercept: c/d
            }
          };
        }
      }],
      investigations: [
        "מצא את תחום ההגדרה של הפונקציה",
        "מצא את כל האסימפטוטות (אנכיות ואופקיות)",
        "מצא את נקודות החיתוך עם הצירים",
        "מצא נקודות קיצון",
        "קבע תחומי עליה וירידה"
      ]
    },
    hard: {
      types: [{
        name: translations.rational,
        generator: () => {
          // Complex rational function (ax²+bx+c)/(dx+e)
          const a = Math.floor(Math.random() * 3) + 1;
          const b = Math.floor(Math.random() * 8) - 4;
          const c = Math.floor(Math.random() * 8) - 4;
          const d = Math.floor(Math.random() * 3) + 1;
          const e = Math.floor(Math.random() * 6) - 3;
          return {
            expression: `f(x) = (${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c})/(${d}x ${e >= 0 ? "+" : ""}${e})`,
            points: [a, b, c, d, e],
            type: "rational",
            characteristics: {
              domain: `x ≠ ${-e/d}`,
              range: "ℝ",
              roots: [],
              criticalPoints: [],
              yIntercept: c/e
            }
          };
        }
      }],
      investigations: [
        "מצא את תחום ההגדרה של הפונקציה",
        "מצא את כל האסימפטוטות (אנכיות, אופקיות ומשופעות)",
        "מצא את נקודות החיתוך עם הצירים",
        "מצא נקודות קיצון",
        "מצא נקודות פיתול",
        "קבע תחומי עליה וירידה",
        "חקור התנהגות בסביבת האסימפטוטות"
      ]
    }
  },
  [FunctionType.TRIGONOMETRIC]: {
    easy: {
      types: [{
        name: translations.trigonometric,
        generator: () => {
          const a = Math.floor(Math.random() * 3) + 1;  // amplitude: 1 to 3
          const funcs = ['sin', 'cos', 'tan'];
          const selectedFunc = funcs[Math.floor(Math.random() * 3)];
          return {
            expression: `f(x) = ${a}${selectedFunc}(x)`,
            points: [a],
            type: "trigonometric",
            characteristics: {
              domain: selectedFunc === 'tan' ? "x ≠ π/2 + πn" : "ℝ",
              range: selectedFunc === 'tan' ? "ℝ" : `[-${a}, ${a}]`,
              period: selectedFunc === 'tan' ? Math.PI : 2 * Math.PI,
              roots: [],
              criticalPoints: [],
              yIntercept: selectedFunc === 'sin' ? 0 : (selectedFunc === 'cos' ? a : 0)
            }
          };
        }
      }],
      investigations: hebrewInvestigations.easy
    },
    medium: {
      types: [{
        name: translations.trigonometric,
        generator: () => {
          const a = Math.floor(Math.random() * 4) + 1;    // amplitude: 1 to 4
          const b = Math.floor(Math.random() * 3) + 1;    // frequency: 1 to 3
          const funcs = ['sin', 'cos', 'tan'];
          const selectedFunc = funcs[Math.floor(Math.random() * 3)];
          return {
            expression: `f(x) = ${a}${selectedFunc}(${b}x)`,
            points: [a, b],
            type: "trigonometric",
            characteristics: {
              domain: selectedFunc === 'tan' ? `x ≠ π/${2*b} + πn/${b}` : "ℝ",
              range: selectedFunc === 'tan' ? "ℝ" : `[-${a}, ${a}]`,
              period: selectedFunc === 'tan' ? Math.PI/b : (2 * Math.PI)/b,
              roots: [],
              criticalPoints: [],
              yIntercept: selectedFunc === 'sin' ? 0 : (selectedFunc === 'cos' ? a : 0)
            }
          };
        }
      }],
      investigations: hebrewInvestigations.medium
    },
    hard: {
      types: [{
        name: translations.trigonometric,
        generator: () => {
          const a = Math.floor(Math.random() * 4) + 1;    // amplitude: 1 to 4
          const b = Math.floor(Math.random() * 3) + 1;    // frequency: 1 to 3
          const c = Math.floor(Math.random() * 5) - 2;    // phase shift
          const d = Math.floor(Math.random() * 7) - 3;    // vertical shift
          const funcs = ['sin', 'cos', 'tan'];
          const selectedFunc = funcs[Math.floor(Math.random() * 3)];
          return {
            expression: `f(x) = ${a}${selectedFunc}(${b}x ${c >= 0 ? "+" : ""}${c}) ${d >= 0 ? "+" : ""}${d}`,
            points: [a, b, c, d],
            type: "trigonometric",
            characteristics: {
              domain: selectedFunc === 'tan' ? `x ≠ π/${2*b} + πn/${b}` : "ℝ",
              range: selectedFunc === 'tan' ? "ℝ" : `[${-a+d}, ${a+d}]`,
              period: selectedFunc === 'tan' ? Math.PI/b : (2 * Math.PI)/b,
              roots: [],
              criticalPoints: [],
              yIntercept: selectedFunc === 'sin' ? 
                d + a * Math.sin(c) : 
                (selectedFunc === 'cos' ? 
                  d + a * Math.cos(c) : 
                  d + a * Math.tan(c))
            }
          };
        }
      }],
      investigations: hebrewInvestigations.hard
    }
  },
  [FunctionType.CIRCLE]: {
    easy: {
      types: [{
        name: translations.circle,
        generator: () => {
          const centerX = Math.floor(Math.random() * 7) - 3;  // -3 to 3
          const centerY = Math.floor(Math.random() * 7) - 3;  // -3 to 3
          const radius = Math.floor(Math.random() * 3) + 1;   // 1 to 3
          return {
            type: "circle",
            center: { x: centerX, y: centerY },
            radius: radius,
            expression: `(x ${centerX >= 0 ? '-' : '+'} ${Math.abs(centerX)})² + (y ${centerY >= 0 ? '-' : '+'} ${Math.abs(centerY)})² = ${radius}²`,
            points: [centerX, centerY, radius]
          };
        }
      }],
      investigations: [
        "מצא את מרכז המעגל",
        "חשב את רדיוס המעגל",
        "מצא את נקודות החיתוך עם הצירים",
        "חשב את שטח המעגל",
        "חשב את היקף המעגל"
      ]
    },
    medium: {
      types: [{
        name: translations.circle,
        generator: () => {
          const centerX = Math.floor(Math.random() * 9) - 4;  // -4 to 4
          const centerY = Math.floor(Math.random() * 9) - 4;  // -4 to 4
          const radius = Math.floor(Math.random() * 4) + 2;   // 2 to 5
          return {
            type: "circle",
            center: { x: centerX, y: centerY },
            radius: radius,
            expression: `(x ${centerX >= 0 ? '-' : '+'} ${Math.abs(centerX)})² + (y ${centerY >= 0 ? '-' : '+'} ${Math.abs(centerY)})² = ${radius}²`,
            points: [centerX, centerY, radius]
          };
        }
      }],
      investigations: [
        "מצא את מרכז המעגל ורדיוסו",
        "מצא את נקודות החיתוך עם הצירים",
        "מצא את נקודות החיתוך עם ישר נתון",
        "מצא משוואת המשיקים למעגל מנקודה חיצונית",
        "חשב את שטח המשולש הנוצר בין שני משיקים ומרכז המעגל"
      ]
    },
    hard: {
      types: [{
        name: translations.circle,
        generator: () => {
          const centerX = (Math.floor(Math.random() * 21) - 10) / 2;  // -5 to 5 in 0.5 steps
          const centerY = (Math.floor(Math.random() * 21) - 10) / 2;  // -5 to 5 in 0.5 steps
          const radius = (Math.floor(Math.random() * 8) + 4) / 2;     // 2 to 5.5 in 0.5 steps
          return {
            type: "circle",
            center: { x: centerX, y: centerY },
            radius: radius,
            expression: `(x ${centerX >= 0 ? '-' : '+'} ${Math.abs(centerX)})² + (y ${centerY >= 0 ? '-' : '+'} ${Math.abs(centerY)})² = ${radius}²`,
            points: [centerX, centerY, radius]
          };
        }
      }],
      investigations: [
        "מצא את מרכז המעגל ורדיוסו",
        "מצא את נקודות החיתוך עם הצירים",
        "מצא משוואות משיקים למעגל בנקודות החיתוך עם הצירים",
        "חשב את שטח המרובע הנוצר בין המשיקים",
        "מצא את המרחק בין מרכז המעגל לישר נתון",
        "קבע האם נקודה נתונה נמצאת בתוך, על או מחוץ למעגל",
        "חשב את שטח הטרפז הנוצר בין שני משיקים מקבילים"
      ]
    }
  }
};

// Add type for select event handlers
type DifficultyChangeEvent = ChangeEvent<HTMLSelectElement>;
type FunctionTypeChangeEvent = ChangeEvent<HTMLSelectElement>;

const MathQuestionGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [functionType, setFunctionType] = useState<FunctionType>(FunctionType.POLYNOMIAL);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Update event handlers with proper types
  const handleDifficultyChange = (e: DifficultyChangeEvent) => {
    setDifficulty(e.target.value as "easy" | "medium" | "hard");
  };

  const handleFunctionTypeChange = (e: FunctionTypeChangeEvent) => {
    setFunctionType(e.target.value as FunctionType);
  };

  // Update the generateQuestion function to use CircleGenerator
  const generateQuestion = () => {
    let newQuestion: Question | null = null;
    const template = questionTemplates[functionType][difficulty];
    
    if (!template?.types?.length) {
      console.error(`Error: No types available for ${functionType} ${difficulty}`);
      return;
    }

    const typeIndex = Math.floor(Math.random() * template.types.length);
    const selectedTemplate = template.types[typeIndex];
    
    try {
      if (functionType === FunctionType.CIRCLE) {
        const generated = CircleGenerator.generate(difficulty);
        newQuestion = {
          type: FunctionType.CIRCLE,
          function: generated,
          investigations: template.investigations
        };
      } else {
        newQuestion = {
          type: functionType,
          function: selectedTemplate.generator(),
          investigations: template.investigations
        };
      }

      if (newQuestion) {
        setCurrentQuestion(null);
        setTimeout(() => setCurrentQuestion(newQuestion), 0);
      }
    } catch (error) {
      console.error(`Error generating ${functionType} function:`, error);
    }
  };

  const plotFunction = (func: FunctionData | CircleData) => {
    if (!func) {
      console.error('Error: No function provided to plot');
      return null;
    }

    if (func.type === 'circle') {
      return GraphVisualizer.createCircleGraph(func as CircleData);
    }
    
    return GraphVisualizer.createGraph(
      func.func || ((x: number) => {
        try {
          switch (func.type) {
            case "linear":
              return func.points[0] * x + func.points[1];
            case "quadratic":
              return func.points[0] * x * x + func.points[1] * x + func.points[2];
            case "cubic":
              return func.points[0] * x * x * x + func.points[1] * x * x + 
                     func.points[2] * x + func.points[3];
            case "quartic":
              return func.points[0] * Math.pow(x, 4) + func.points[1] * Math.pow(x, 3) + 
                     func.points[2] * x * x + func.points[3] * x + func.points[4];
            case "rational": {
              const n = func.points.length;
              const mid = Math.floor(n/2);
              let num = 0, den = 0;
              
              for (let i = 0; i < mid; i++) {
                num += func.points[i] * Math.pow(x, mid-i-1);
              }
              for (let i = mid; i < n; i++) {
                den += func.points[i] * Math.pow(x, n-i-1);
              }
              
              // Handle division by zero and very large values
              if (Math.abs(den) < 1e-10) return undefined;
              const result = num/den;
              if (!isFinite(result) || Math.abs(result) > 1000) return undefined;
              
              return result;
            }
            case "trigonometric": {
              const a = func.points[0];
              if (func.expression.includes('sin')) return a * Math.sin(x);
              if (func.expression.includes('cos')) return a * Math.cos(x);
              if (func.expression.includes('tan')) return a * Math.tan(x);
              return 0;
            }
            default:
              console.error(`Error: Unsupported function type: ${func.type}`);
              return 0;
          }
        } catch (error) {
          console.error(`Error evaluating ${func.type} function:`, error);
          return undefined;
        }
      }),
      func.characteristics || {
        roots: [],
        criticalPoints: [],
        yIntercept: 0,
        domain: [-10, 10],
        range: [-10, 10]
      }
    );
  };

  return (
    <div className="min-h-screen font-heebo bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-right">
      {/* Header Section - Make text smaller on mobile */}
      <header className="py-6 sm:py-12 px-4 text-center bg-white/30 backdrop-blur-sm shadow-sm">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 animate-fade-in">
          {translations.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          {translations.subtitle}
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Controls Section - Stack controls vertically on mobile */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8 transform hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-base sm:text-lg font-medium text-gray-700">
                {translations.difficultyLevel}
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl 
                          shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white transition duration-150 ease-in-out text-base sm:text-lg"
                value={difficulty}
                onChange={handleDifficultyChange}
              >
                <option value="easy">{translations.easy}</option>
                <option value="medium">{translations.medium}</option>
                <option value="hard">{translations.hard}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-base sm:text-lg font-medium text-gray-700">
                {translations.functionType}
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl 
                          shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white transition duration-150 ease-in-out text-base sm:text-lg"
                value={functionType}
                onChange={handleFunctionTypeChange}
              >
                <option value={FunctionType.LINEAR}>{translations.linear}</option>
                <option value={FunctionType.QUADRATIC}>{translations.quadratic}</option>
                <option value={FunctionType.POLYNOMIAL}>{translations.polynomial}</option>
                <option value={FunctionType.RATIONAL}>{translations.rational}</option>
                <option value={FunctionType.TRIGONOMETRIC}>{translations.trigonometric}</option>
                <option value={FunctionType.CIRCLE}>{translations.circle}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                className="w-full px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 
                          to-indigo-600 text-white text-base sm:text-lg font-medium rounded-xl 
                          shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none 
                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all 
                          duration-300 transform hover:scale-105 active:scale-95"
                onClick={generateQuestion}
              >
                {translations.generate}
              </button>
            </div>
          </div>
        </div>

        {/* Function Display and Investigation Section */}
        {currentQuestion && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 space-y-4 sm:space-y-8 animate-fade-in">
            {/* Function Expression */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                {translations.functionDisplay}
              </h2>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl text-lg sm:text-xl font-medium text-gray-800">
                {currentQuestion.function.expression}
              </div>
            </div>

            {/* Graph */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                {translations.graphTitle}
              </h2>
              <div className="aspect-square w-full max-w-2xl mx-auto bg-white rounded-xl p-2 sm:p-4">
                {plotFunction(currentQuestion.function)}
              </div>
            </div>

            {/* Investigation Steps */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                {translations.investigationSteps}
              </h2>
              <ul className="space-y-2 text-base sm:text-lg text-gray-700">
                {currentQuestion.investigations.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="font-bold ml-2">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MathQuestionGenerator;
