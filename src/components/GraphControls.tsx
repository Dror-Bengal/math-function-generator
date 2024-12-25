import React from 'react';

interface GraphControlsProps {
  isSketchMode: boolean;
  showSolution: boolean;
  onSketchModeToggle: () => void;
  onSolutionToggle: () => void;
  translations: {
    graphFirst: string;
    sketchFirst: string;
    showSolution: string;
    hideSolution: string;
  };
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  isSketchMode,
  showSolution,
  onSketchModeToggle,
  onSolutionToggle,
  translations,
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onSketchModeToggle}
        className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
      >
        {isSketchMode ? translations.graphFirst : translations.sketchFirst}
      </button>
      {isSketchMode && (
        <button
          onClick={onSolutionToggle}
          className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          {showSolution ? translations.hideSolution : translations.showSolution}
        </button>
      )}
    </div>
  );
}; 