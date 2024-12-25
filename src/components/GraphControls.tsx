import React from 'react';

interface GraphControlsProps {
  isSketchMode: boolean;
  showSolution: boolean;
  isInvestigationMode: boolean;
  onSketchModeToggle: () => void;
  onSolutionToggle: () => void;
  onInvestigationModeToggle: () => void;
  translations: {
    graphFirst: string;
    sketchFirst: string;
    showSolution: string;
    hideSolution: string;
    investigationMode: string;
  };
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  isSketchMode,
  showSolution,
  isInvestigationMode,
  onSketchModeToggle,
  onSolutionToggle,
  onInvestigationModeToggle,
  translations,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={onSketchModeToggle}
          className={`flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium ${
            !isSketchMode && !isInvestigationMode 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300`}
        >
          {translations.graphFirst}
        </button>
        <button
          onClick={onSketchModeToggle}
          className={`flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium ${
            isSketchMode 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300`}
        >
          {translations.sketchFirst}
        </button>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onInvestigationModeToggle}
          className={`flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium ${
            isInvestigationMode 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300`}
        >
          {translations.investigationMode}
        </button>
        {(isSketchMode || isInvestigationMode) && (
          <button
            onClick={onSolutionToggle}
            className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            {showSolution ? translations.hideSolution : translations.showSolution}
          </button>
        )}
      </div>
    </div>
  );
}; 