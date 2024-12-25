import React from 'react';
import { useState, ChangeEvent } from 'react';
import { 
  LinearGraphVisualizer,
  QuadraticGraphVisualizer,
  PolynomialGraphVisualizer,
  RationalGraphVisualizer,
  TrigonometricGraphVisualizer,
  CircleGraphVisualizer
} from './services/graphVisualizers';
import { 
  FunctionType, 
  FunctionData, 
  CircleData,
  FunctionCharacteristics,
  Point 
} from './types/FunctionTypes';
import { allTemplates } from './templates/questionTemplates';
import { hebrewInvestigations, sketchInvestigations } from './templates/investigations';
import { MainLayout } from './components/MainLayout';
import { translations } from './templates/translations';

// ============================================================================
// Type Definitions & Interfaces
// ============================================================================
type DifficultyChangeEvent = ChangeEvent<HTMLSelectElement>;
type FunctionTypeChangeEvent = ChangeEvent<HTMLSelectElement>;

interface Question {
  type: FunctionType;
  function: FunctionData | CircleData;
  investigations: string[];
}

// ============================================================================
// Constants
// ============================================================================
const IS_GRAPH_FIRST = true;

// ============================================================================
// Main App Component
// ============================================================================
export default function App() {
  // ============================================================================
  // State Management
  // ============================================================================
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [functionType, setFunctionType] = useState<FunctionType>(FunctionType.LINEAR);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [sketchPoints, setSketchPoints] = useState<Point[]>([]);
  const [sketchFeedback, setSketchFeedback] = useState<string>('');
  const [sketchAccuracy, setSketchAccuracy] = useState<number | null>(null);
  const [isInvestigationMode, setIsInvestigationMode] = useState(false);

  // ============================================================================
  // Event Handlers
  // ============================================================================
  const handleDifficultyChange = (e: DifficultyChangeEvent) => {
    setDifficulty(e.target.value as "easy" | "medium" | "hard");
    setSketchPoints([]);
    setSketchFeedback('');
    setSketchAccuracy(null);
  };

  const handleFunctionTypeChange = (e: FunctionTypeChangeEvent) => {
    setFunctionType(e.target.value as FunctionType);
    setSketchPoints([]);
    setSketchFeedback('');
    setSketchAccuracy(null);
  };

  const handleModeToggle = (mode: 'graph' | 'sketch' | 'investigation') => {
    setIsSketchMode(mode === 'sketch');
    setIsInvestigationMode(mode === 'investigation');
    setShowQuestions(mode === 'investigation');
    if (mode !== 'sketch') {
      setSketchPoints([]);
      setSketchFeedback('');
      setSketchAccuracy(null);
    }
  };

  const handleStepToggle = (index: number) => {
    const newCompletedSteps = new Set(completedSteps);
    if (completedSteps.has(index)) {
      newCompletedSteps.delete(index);
    } else {
      newCompletedSteps.add(index);
    }
    setCompletedSteps(newCompletedSteps);
  };

  // ============================================================================
  // Function Generation & Question Management
  // ============================================================================
  const generateQuestion = () => {
    let newQuestion: Question | null = null;
    const templateKey = functionType.toLowerCase() as keyof typeof allTemplates;
    const template = allTemplates[templateKey]?.[difficulty];
    
    if (!template?.types?.length) {
      console.error(`Error: No types available for ${functionType} ${difficulty}`);
      return;
    }

    const typeIndex = Math.floor(Math.random() * template.types.length);
    const selectedTemplate = template.types[typeIndex];
    
    try {
      const generatedFunction = selectedTemplate.generator();
      if (!generatedFunction || !generatedFunction.type) {
        console.error('Invalid function generated:', generatedFunction);
        return;
      }

      newQuestion = {
        type: functionType,
        function: generatedFunction,
        investigations: template.investigations
      };

      if (newQuestion) {
        setCurrentQuestion(null);
        setShowQuestions(false);
        setTimeout(() => {
          setCurrentQuestion(newQuestion);
          setShowQuestions(!IS_GRAPH_FIRST);
        }, 0);
      }
    } catch (error) {
      console.error(`Error generating ${functionType} function:`, error);
    }
  };

  // ============================================================================
  // Function Visualization
  // ============================================================================
  const visualizeFunction = (
    func: ((x: number) => number | undefined) | undefined,
    characteristics: FunctionCharacteristics,
    data?: FunctionData | CircleData
  ): JSX.Element | null => {
    if (characteristics.type === FunctionType.CIRCLE && data) {
      const circleData: CircleData = {
        type: FunctionType.CIRCLE,
        expression: data.expression,
        characteristics,
        center: { 
          x: data.points?.[0] || 0,
          y: data.points?.[1] || 0
        },
        radius: data.points?.[2] || 1,
        points: data.points || [],
        equation: data.expression || ''
      };

      return new CircleGraphVisualizer().plot(circleData, characteristics, {});
    }

    if (!func) {
      console.error('No function provided for non-circle type');
      return null;
    }

    let visualizer;
    switch (characteristics.type) {
      case FunctionType.LINEAR:
        visualizer = new LinearGraphVisualizer();
        break;
      case FunctionType.QUADRATIC:
        visualizer = new QuadraticGraphVisualizer();
        break;
      case FunctionType.POLYNOMIAL:
        visualizer = new PolynomialGraphVisualizer();
        break;
      case FunctionType.RATIONAL:
        visualizer = new RationalGraphVisualizer();
        break;
      case FunctionType.TRIGONOMETRIC:
        visualizer = new TrigonometricGraphVisualizer();
        break;
      default:
        console.error(`Unsupported function type: ${characteristics.type}`);
        return null;
    }

    return visualizer.plot(func, characteristics);
  };

  // ============================================================================
  // Function Evaluation & Plotting
  // ============================================================================
  const plotFunction = (data: FunctionData | CircleData) => {
    if (!data || !data.type) {
      console.error('Invalid function data:', data);
      return null;
    }

    const characteristics = data.characteristics;
    if (!characteristics) {
      console.error('No characteristics provided');
      return null;
    }

    characteristics.type = characteristics.type || data.type;

    const evaluateFunction = (x: number): number | undefined => {
      if (!data.points || !Array.isArray(data.points)) {
        console.error('Invalid points array:', data.points);
        return undefined;
      }

      try {
        switch (data.type) {
          case FunctionType.LINEAR:
            return data.points[0] * x + data.points[1];
          case FunctionType.QUADRATIC:
            return data.points[0] * x * x + data.points[1] * x + data.points[2];
          case FunctionType.POLYNOMIAL:
            return data.points[0] * x * x * x + data.points[1] * x * x + data.points[2] * x + data.points[3];
          case FunctionType.RATIONAL: {
            const n = data.points.length;
            const mid = Math.floor(n / 2);
            let num = 0, den = 0;
            for (let i = 0; i < mid; i++) {
              num += data.points[i] * Math.pow(x, mid - i - 1);
            }
            for (let i = mid; i < n; i++) {
              den += data.points[i] * Math.pow(x, n - i - 1);
            }
            if (Math.abs(den) < 1e-10) return undefined;
            const result = num / den;
            if (!isFinite(result) || Math.abs(result) > 1e3) return undefined;
            return result;
          }
          case FunctionType.TRIGONOMETRIC: {
            const [a, b, c, d] = data.points;
            return a * Math.sin(b * x + c) + d;
          }
          case FunctionType.CIRCLE:
            return undefined;
          default:
            console.error(`Unsupported function type: ${data.type}`);
            return undefined;
        }
      } catch (error) {
        console.error("Error evaluating function:", error);
        return undefined;
      }
    };

    return visualizeFunction(
      data.type === FunctionType.CIRCLE ? undefined : evaluateFunction,
      characteristics,
      data
    );
  };

  // ============================================================================
  // Sketch Handling & Validation
  // ============================================================================
  const handleSketchComplete = (points: Point[]) => {
    setSketchPoints(points);
    if (currentQuestion?.function && points.length > 0) {
      validateSketch(points, currentQuestion.function);
    }
  };

  const validateSketch = (sketch: Point[], solution: FunctionData | CircleData) => {
    if (solution.type === FunctionType.CIRCLE) return;
    
    const solutionPoints = generateSolutionPoints(solution as FunctionData);
    let totalError = 0;
    let matchedPoints = 0;

    sketch.forEach(sketchPoint => {
      const closestSolutionPoint = solutionPoints.reduce((closest, current) => {
        const currentDist = Math.abs(current.x - sketchPoint.x);
        const closestDist = Math.abs(closest.x - sketchPoint.x);
        return currentDist < closestDist ? current : closest;
      });

      const error = Math.abs(closestSolutionPoint.y - sketchPoint.y);
      if (error < 0.5) matchedPoints++;
      totalError += error;
    });

    const accuracy = (matchedPoints / sketch.length) * 100;
    setSketchAccuracy(accuracy);
    
    if (accuracy >= 80) {
      setSketchFeedback(translations.goodSketch);
    } else {
      setSketchFeedback(translations.tryAgain);
    }
  };

  const generateSolutionPoints = (data: FunctionData): Point[] => {
    const xMin = -10;
    const xMax = 10;
    const step = 0.1;
    const points: Point[] = [];

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(x, data);
      if (y !== undefined) {
        points.push({ x, y });
      }
    }

    return points;
  };

  // ============================================================================
  // Investigation Steps Management
  // ============================================================================
  const getInvestigationSteps = () => {
    if (isSketchMode) {
      return sketchInvestigations[difficulty];
    }
    return hebrewInvestigations[difficulty];
  };

  // ============================================================================
  // Function Evaluation
  // ============================================================================
  const evaluateFunction = (x: number, data: FunctionData): number | undefined => {
    if (!data.points || !Array.isArray(data.points)) {
      console.error('Invalid points array:', data.points);
      return undefined;
    }

    try {
      switch (data.type) {
        case FunctionType.LINEAR:
          return data.points[0] * x + data.points[1];
        case FunctionType.QUADRATIC:
          return data.points[0] * x * x + data.points[1] * x + data.points[2];
        case FunctionType.POLYNOMIAL:
          return data.points[0] * x * x * x + data.points[1] * x * x + data.points[2] * x + data.points[3];
        case FunctionType.RATIONAL: {
          const n = data.points.length;
          const mid = Math.floor(n / 2);
          let num = 0, den = 0;
          for (let i = 0; i < mid; i++) {
            num += data.points[i] * Math.pow(x, mid - i - 1);
          }
          for (let i = mid; i < n; i++) {
            den += data.points[i] * Math.pow(x, n - i - 1);
          }
          if (Math.abs(den) < 1e-10) return undefined;
          const result = num / den;
          if (!isFinite(result) || Math.abs(result) > 1e3) return undefined;
          return result;
        }
        case FunctionType.TRIGONOMETRIC: {
          const [a, b, c, d] = data.points;
          return a * Math.sin(b * x + c) + d;
        }
        default:
          return undefined;
      }
    } catch (error) {
      console.error("Error evaluating function:", error);
      return undefined;
    }
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <MainLayout
      difficulty={difficulty}
      functionType={functionType}
      currentQuestion={currentQuestion}
      completedSteps={completedSteps}
      showQuestions={showQuestions}
      showSolution={showSolution}
      isSketchMode={isSketchMode}
      isInvestigationMode={isInvestigationMode}
      sketchPoints={sketchPoints}
      sketchAccuracy={sketchAccuracy}
      sketchFeedback={sketchFeedback}
      onDifficultyChange={handleDifficultyChange}
      onFunctionTypeChange={handleFunctionTypeChange}
      onGenerateQuestion={generateQuestion}
      onModeToggle={handleModeToggle}
      onSolutionToggle={() => setShowSolution(!showSolution)}
      onStepToggle={handleStepToggle}
      onSketchComplete={handleSketchComplete}
      getInvestigationSteps={getInvestigationSteps}
      plotFunction={plotFunction}
      generateSolutionPoints={generateSolutionPoints}
    />
  );
}
