import React from 'react';
import { useState, ChangeEvent } from 'react';
import { GraphVisualizer } from './services/GraphVisualizer';
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
  const [showGraph, setShowGraph] = useState(false);
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
      newQuestion = {
        type: functionType,
        function: selectedTemplate.generator(),
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

  const plotFunction = (func: FunctionData | CircleData) => {
    if (!func) {
      console.error('Error: No function provided to plot');
      return null;
    }

    if (func.type === FunctionType.CIRCLE) {
      return GraphVisualizer.createCircleGraph(func as CircleData);
    }
    
    const evaluateFunction = (x: number): number | undefined => {
      try {
        switch (func.type) {
          case FunctionType.LINEAR:
            return func.points[0] * x + func.points[1];
          case FunctionType.QUADRATIC:
            return func.points[0] * x * x + func.points[1] * x + func.points[2];
          case FunctionType.POLYNOMIAL:
            return func.points[0] * x * x * x + func.points[1] * x * x + 
                   func.points[2] * x + func.points[3];
          case FunctionType.RATIONAL: {
            const n = func.points.length;
            const mid = Math.floor(n/2);
            let num = 0, den = 0;
            
            for (let i = 0; i < mid; i++) {
              num += func.points[i] * Math.pow(x, mid-i-1);
            }
            for (let i = mid; i < n; i++) {
              den += func.points[i] * Math.pow(x, n-i-1);
            }
            
            if (Math.abs(den) < 1e-10) return undefined;
            const result = num/den;
            if (!isFinite(result) || Math.abs(result) > 1000) return undefined;
            
            return result;
          }
          case FunctionType.TRIGONOMETRIC: {
            const a = func.points[0];
            const b = func.points[1];
            const c = func.points[2];
            const d = func.points[3];
            return a * Math.sin(b * x + c) + d;
          }
          default:
            console.error(`Error: Unsupported function type: ${func.type}`);
            return 0;
        }
      } catch (error) {
        console.error('Error evaluating function:', error);
        return 0;
      }
    };

    // Create a properly typed characteristics object with required properties
    const characteristics: FunctionCharacteristics = {
      domain: func.characteristics?.domain || "ℝ",
      range: func.characteristics?.range || "ℝ",
      roots: func.characteristics?.roots || [],
      criticalPoints: func.characteristics?.criticalPoints || [],
      yIntercept: func.characteristics?.yIntercept || 0,
      type: func.type
    };

    return GraphVisualizer.plot(
      func.func || evaluateFunction,
      characteristics
    );
  };

  const toggleGraph = () => setShowGraph(!showGraph);

  const handleStepComplete = (stepIndex: number, isComplete: boolean) => {
    const newCompletedSteps = new Set(completedSteps);
    if (isComplete) {
      newCompletedSteps.add(stepIndex);
    } else {
      newCompletedSteps.delete(stepIndex);
    }
    setCompletedSteps(newCompletedSteps);
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
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                  {translations.graphTitle}
                </h2>
                <button
                  onClick={toggleGraph}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {showGraph ? 'הסתר גרף' : 'הצג גרף'}
                </button>
              </div>
              {showGraph && (
                <div className="aspect-square w-full max-w-2xl mx-auto bg-white rounded-xl p-2 sm:p-4">
                  {plotFunction(currentQuestion.function)}
                </div>
              )}
            </div>

            {/* Investigation Steps */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                {translations.investigationSteps}
              </h2>
              <ul className="space-y-2 text-base sm:text-lg text-gray-700">
                {currentQuestion.investigations.map((step, index) => (
                  <li key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id={`step-${index}`}
                      className="h-5 w-5 text-blue-600"
                      onChange={(e) => handleStepComplete(index, e.target.checked)}
                    />
                    <label htmlFor={`step-${index}`} className="text-gray-700">
                      <span className="font-bold ml-2">{index + 1}.</span>
                      <span>{step}</span>
                    </label>
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
