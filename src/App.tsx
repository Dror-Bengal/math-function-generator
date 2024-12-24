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
  FunctionCharacteristics 
} from './types/FunctionTypes';
import { translations } from './templates/translations';
import { allTemplates } from './templates/questionTemplates';

// Add type for select event handlers
type DifficultyChangeEvent = ChangeEvent<HTMLSelectElement>;
type FunctionTypeChangeEvent = ChangeEvent<HTMLSelectElement>;

interface Question {
  type: FunctionType;
  function: FunctionData | CircleData;
  investigations: string[];
}

const MathQuestionGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [functionType, setFunctionType] = useState<FunctionType>(FunctionType.POLYNOMIAL);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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
      // Validate the generated function has the required properties
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
        setTimeout(() => setCurrentQuestion(newQuestion), 0);
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

  return (
    <div className="min-h-screen font-heebo bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <header className="py-6 sm:py-12 px-4 text-center bg-white/30 backdrop-blur-sm shadow-sm">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 animate-fade-in">
          {translations.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          {translations.subtitle}
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg sm:rounded-3xl sm:p-12">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Controls */}
              <div className="lg:w-1/3 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-right">
                  {currentQuestion?.function?.expression || translations.givenFunction}
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-base font-medium text-gray-700 text-right">
                      {translations.difficultyLevel}
                    </label>
                    <select
                      value={difficulty}
                      onChange={handleDifficultyChange}
                      className="block w-full p-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                      className="block w-full p-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={FunctionType.LINEAR}>{translations.linear}</option>
                      <option value={FunctionType.QUADRATIC}>{translations.quadratic}</option>
                      <option value={FunctionType.POLYNOMIAL}>{translations.polynomial}</option>
                      <option value={FunctionType.RATIONAL}>{translations.rational}</option>
                      <option value={FunctionType.TRIGONOMETRIC}>{translations.trigonometric}</option>
                      <option value={FunctionType.CIRCLE}>{translations.circle}</option>
                    </select>
                  </div>

                  <button
                    onClick={generateQuestion}
                    className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                  >
                    {translations.generate}
                  </button>
                </div>

                {currentQuestion && (
                  <div className="mt-8 text-right">
                    <h3 className="text-xl font-semibold mb-4">{translations.investigationSteps}</h3>
                    <div className="space-y-3">
                      {currentQuestion.investigations.map((investigation, index) => (
                        <div key={index} className="flex items-start gap-3 text-right">
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
                            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="flex-grow text-right">
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
                  <h3 className="text-xl font-semibold">{translations.graphTitle}</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  {currentQuestion?.function && (
                    plotFunction(currentQuestion.function)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathQuestionGenerator;
