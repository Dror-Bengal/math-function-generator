import React from 'react';
import { FunctionType, FunctionData, CircleData, Point } from '../types/FunctionTypes';
import { translations } from '../templates/translations';
import { Header } from './Header';
import { GraphControls } from './GraphControls';
import { SketchGraph } from './SketchGraph';

interface MainLayoutProps {
  // State
  difficulty: "easy" | "medium" | "hard";
  functionType: FunctionType;
  currentQuestion: {
    type: FunctionType;
    function: FunctionData | CircleData;
    investigations: string[];
  } | null;
  completedSteps: Set<number>;
  showQuestions: boolean;
  showSolution: boolean;
  isSketchMode: boolean;
  isInvestigationMode: boolean;
  sketchPoints: Point[];
  sketchAccuracy: number | null;
  sketchFeedback: string;

  // Event Handlers
  onDifficultyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFunctionTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenerateQuestion: () => void;
  onModeToggle: (mode: 'graph' | 'sketch' | 'investigation') => void;
  onSolutionToggle: () => void;
  onStepToggle: (index: number) => void;
  onSketchComplete: (points: Point[]) => void;
  getInvestigationSteps: () => string[];
  plotFunction: (data: FunctionData | CircleData) => JSX.Element | null;
  generateSolutionPoints: (data: FunctionData) => Point[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  difficulty,
  functionType,
  currentQuestion,
  completedSteps,
  showQuestions,
  showSolution,
  isSketchMode,
  isInvestigationMode,
  sketchPoints,
  sketchAccuracy,
  sketchFeedback,
  onDifficultyChange,
  onFunctionTypeChange,
  onGenerateQuestion,
  onModeToggle,
  onSolutionToggle,
  onStepToggle,
  onSketchComplete,
  getInvestigationSteps,
  plotFunction,
  generateSolutionPoints,
}) => {
  return (
    <div className="min-h-screen font-heebo bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <Header 
        title={translations.title}
        subtitle={translations.subtitle}
      />

      {/* Main Content Container */}
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl sm:rounded-3xl sm:p-8">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Panel - Controls & Function Info */}
              <div className="lg:w-1/3 space-y-6 bg-white/90 p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 text-right border-b border-gray-200 pb-4">
                  {currentQuestion?.function?.expression || translations.givenFunction}
                </h2>
                
                {/* Control Panel */}
                <div className="space-y-5">
                  {/* Difficulty Selector */}
                  <div className="space-y-2">
                    <label className="block text-base font-medium text-gray-700 text-right">
                      {translations.difficultyLevel}
                    </label>
                    <select
                      value={difficulty}
                      onChange={onDifficultyChange}
                      className="block w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="easy">{translations.easy}</option>
                      <option value="medium">{translations.medium}</option>
                      <option value="hard">{translations.hard}</option>
                    </select>
                  </div>

                  {/* Function Type Selector */}
                  <div className="space-y-2">
                    <label className="block text-base font-medium text-gray-700 text-right">
                      {translations.functionType}
                    </label>
                    <select
                      value={functionType}
                      onChange={onFunctionTypeChange}
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

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={onGenerateQuestion}
                      className="flex-1 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {translations.generate}
                    </button>
                  </div>

                  {/* Mode Toggle Buttons */}
                  {currentQuestion && (
                    <GraphControls
                      isSketchMode={isSketchMode}
                      showSolution={showSolution}
                      isInvestigationMode={isInvestigationMode}
                      onSketchModeToggle={() => onModeToggle(isSketchMode ? 'graph' : 'sketch')}
                      onSolutionToggle={onSolutionToggle}
                      onInvestigationModeToggle={() => onModeToggle(isInvestigationMode ? 'graph' : 'investigation')}
                      translations={{
                        graphFirst: translations.graphFirst,
                        sketchFirst: translations.sketchFirst,
                        showSolution: translations.showSolution,
                        hideSolution: translations.hideSolution,
                        investigationMode: translations.investigationMode
                      }}
                    />
                  )}
                </div>

                {/* Investigation Steps Panel */}
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
                            onChange={() => onStepToggle(index)}
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

              {/* Right Panel - Graph Display */}
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
                  {isSketchMode && sketchPoints.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {translations.pointsDrawn}: {sketchPoints.length}
                    </p>
                  )}
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                  {currentQuestion?.function ? (
                    isSketchMode ? (
                      <SketchGraph
                        onSketchComplete={onSketchComplete}
                        showSolution={showSolution}
                        solutionPoints={currentQuestion.function.type !== FunctionType.CIRCLE ? 
                          generateSolutionPoints(currentQuestion.function as FunctionData) : 
                          []
                        }
                        accuracy={sketchAccuracy}
                        feedback={sketchFeedback}
                      />
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
}; 