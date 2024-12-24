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
import { translations } from './templates/translations';
import { allTemplates } from './templates/questionTemplates';
import { SketchGraph } from './components/SketchGraph';
import { hebrewInvestigations, sketchInvestigations } from './templates/investigations';

// Add type for select event handlers
type DifficultyChangeEvent = ChangeEvent<HTMLSelectElement>;
type FunctionTypeChangeEvent = ChangeEvent<HTMLSelectElement>;

interface Question {
  type: FunctionType;
  function: FunctionData | CircleData;
  investigations: string[];
}

// Add constant for Graph-First mode
const IS_GRAPH_FIRST = true;

export default function App() {
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

  // Update event handlers with proper types
  const handleDifficultyChange = (e: DifficultyChangeEvent) => {
    setDifficulty(e.target.value as "easy" | "medium" | "hard");
  };

  const handleFunctionTypeChange = (e: FunctionTypeChangeEvent) => {
    setFunctionType(e.target.value as FunctionType);
  };

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
          // In Graph-First mode, we don't show questions immediately
          setShowQuestions(!IS_GRAPH_FIRST);
        }, 0);
      }
    } catch (error) {
      console.error(`Error generating ${functionType} function:`, error);
    }
  };

  const visualizeFunction = (
    func: ((x: number) => number | undefined) | undefined,
    characteristics: FunctionCharacteristics,
    data?: FunctionData | CircleData
  ): JSX.Element | null => {
    if (characteristics.type === FunctionType.CIRCLE && data) {
      // Transform circle data from points to center and radius format
      const circleData: CircleData = {
        type: FunctionType.CIRCLE,
        expression: data.expression,
        characteristics,
        center: { 
          x: data.points?.[0] || 0, // h (center x)
          y: data.points?.[1] || 0  // k (center y)
        },
        radius: data.points?.[2] || 1, // r (radius)
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

  const plotFunction = (data: FunctionData | CircleData) => {
    // Validate input data
    if (!data || !data.type) {
      console.error('Invalid function data:', data);
      return null;
    }

    const characteristics = data.characteristics;
    if (!characteristics) {
      console.error('No characteristics provided');
      return null;
    }

    // Ensure characteristics has a valid type
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
            return undefined; // Circle functions are handled differently
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

  const handleSketchComplete = (points: Point[]) => {
    setSketchPoints(points);
    if (currentQuestion?.function && points.length > 0) {
      validateSketch(points, currentQuestion.function);
    }
  };

  const validateSketch = (sketch: Point[], solution: FunctionData | CircleData) => {
    // Basic validation - can be enhanced later
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

  // Get the appropriate investigation steps based on mode
  const getInvestigationSteps = () => {
    if (isSketchMode) {
      return sketchInvestigations[difficulty];
    }
    return hebrewInvestigations[difficulty];
  };

  return (
    <div className="min-h-screen font-heebo bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <header className="py-8 px-4 text-center bg-white/40 backdrop-blur-sm shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3 animate-fade-in">
          {translations.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          {translations.subtitle}
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl sm:rounded-3xl sm:p-8">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Controls */}
              <div className="lg:w-1/3 space-y-6 bg-white/90 p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 text-right border-b border-gray-200 pb-4">
                  {currentQuestion?.function?.expression || translations.givenFunction}
                </h2>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-base font-medium text-gray-700 text-right">
                      {translations.difficultyLevel}
                    </label>
                    <select
                      value={difficulty}
                      onChange={handleDifficultyChange}
                      className="block w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="easy">{translations.easy}</option>
                      <option value="medium">{translations.medium}</option>
                      <option value="hard">{translations.hard}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-base font-medium text-gray-700 text-right">
                      {translations.functionType}
                    </label>
                    <select
                      value={functionType}
                      onChange={handleFunctionTypeChange}
                      className="block w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value={FunctionType.LINEAR}>{translations.linear}</option>
                      <option value={FunctionType.QUADRATIC}>{translations.quadratic}</option>
                      <option value={FunctionType.POLYNOMIAL}>{translations.polynomial}</option>
                      <option value={FunctionType.RATIONAL}>{translations.rational}</option>
                      <option value={FunctionType.TRIGONOMETRIC}>{translations.trigonometric}</option>
                      <option value={FunctionType.CIRCLE}>{translations.circle}</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={generateQuestion}
                      className="flex-1 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {translations.generate}
                    </button>
                  </div>

                  {currentQuestion && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsSketchMode(!isSketchMode)}
                        className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        {isSketchMode ? translations.graphFirst : translations.sketchFirst}
                      </button>
                      {isSketchMode && (
                        <button
                          onClick={() => setShowSolution(!showSolution)}
                          className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                        >
                          {showSolution ? translations.hideSolution : translations.showSolution}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {currentQuestion && showQuestions && (
                  <div className="mt-8 bg-white/80 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 text-right border-b border-gray-200 pb-3">
                      {translations.investigationSteps}
                    </h3>
                    <div className="space-y-4">
                      {getInvestigationSteps().map((investigation, index) => (
                        <div key={index} className="flex items-start gap-4 text-right bg-white/60 p-3 rounded-xl hover:bg-white/80 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={completedSteps.has(index)}
                            onChange={() => {
                              const newCompletedSteps = new Set(completedSteps);
                              if (completedSteps.has(index)) {
                                newCompletedSteps.delete(index);
                              } else {
                                newCompletedSteps.add(index);
                              }
                              setCompletedSteps(newCompletedSteps);
                            }}
                            className="mt-1.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                          />
                          <label className="flex-grow text-right text-gray-700 hover:text-gray-900 transition-colors duration-200">
                            <span className="font-medium ml-2">{index + 1}.</span>
                            {investigation}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Graph */}
              <div className="lg:w-2/3">
                <div className="text-right mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {isSketchMode ? translations.sketchMode : translations.graphTitle}
                    {currentQuestion && !showQuestions && !isSketchMode && (
                      <span className="text-sm text-gray-500 mr-3">
                        {translations.graphFirstInstructions}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                  {currentQuestion?.function ? (
                    isSketchMode ? (
                      <>
                        <SketchGraph
                          onSketchComplete={handleSketchComplete}
                          showSolution={showSolution}
                          solutionPoints={currentQuestion.function.type !== FunctionType.CIRCLE ? 
                            generateSolutionPoints(currentQuestion.function as FunctionData) : 
                            []
                          }
                        />
                        {sketchPoints.length > 0 && sketchFeedback && (
                          <div className={`mt-4 p-4 rounded-xl text-right ${
                            sketchAccuracy && sketchAccuracy >= 80 
                              ? 'bg-green-50 text-green-800' 
                              : 'bg-yellow-50 text-yellow-800'
                          }`}>
                            <p className="font-medium">{sketchFeedback}</p>
                            {sketchAccuracy && (
                              <p className="text-sm mt-1">
                                דיוק: {sketchAccuracy.toFixed(1)}%
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      plotFunction(currentQuestion.function)
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">
                        {translations.welcomeMessage}
                      </h4>
                      <p className="text-gray-600 max-w-md mb-6">
                        {translations.startMessage}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{translations.selectDifficulty}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{translations.selectType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
