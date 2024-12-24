import React, { useState, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { translations } from '../templates/translations';
import { Point } from '../types/FunctionTypes';

interface SketchGraphProps {
  width?: number;
  height?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  onSketchComplete?: (points: Point[]) => void;
  showSolution?: boolean;
  solutionPoints?: Point[];
}

export const SketchGraph: React.FC<SketchGraphProps> = ({
  width = 800,
  height = 500,
  xRange = [-10, 10],
  yRange = [-10, 10],
  onSketchComplete,
  showSolution = false,
  solutionPoints = []
}) => {
  const [sketchPoints, setSketchPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const handlePlotClick = useCallback((event: any) => {
    if (!event?.points?.[0]) return;
    
    const point = {
      x: event.points[0].x,
      y: event.points[0].y
    };
    
    if (!isDrawing) {
      console.log('Starting new sketch at:', point);
      setIsDrawing(true);
      setSketchPoints([point]);
      setLastPoint(point);
    } else {
      console.log('Ending sketch at:', point);
      setIsDrawing(false);
      const newPoints = [...sketchPoints, point];
      setSketchPoints(newPoints);
      if (onSketchComplete) {
        onSketchComplete(newPoints);
      }
      setLastPoint(null);
    }
  }, [isDrawing, sketchPoints, onSketchComplete]);

  const handleMouseMove = useCallback((event: any) => {
    if (!isDrawing || !event?.points?.[0] || !lastPoint) return;

    const point = {
      x: event.points[0].x,
      y: event.points[0].y
    };

    // Only add point if it's far enough from the last point
    const distance = Math.sqrt(
      Math.pow(point.x - lastPoint.x, 2) + 
      Math.pow(point.y - lastPoint.y, 2)
    );

    if (distance > 0.1) { // Minimum distance between points
      console.log('Adding point:', point);
      setSketchPoints(prev => [...prev, point]);
      setLastPoint(point);
    }
  }, [isDrawing, lastPoint]);

  const clearSketch = useCallback(() => {
    console.log('Clearing sketch');
    setSketchPoints([]);
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const traces: Partial<PlotData>[] = [
    // Grid lines
    {
      type: 'scatter',
      mode: 'lines',
      x: [-10, 10],
      y: [0, 0],
      line: { color: '#000000', width: 2 },
      name: 'x-axis'
    },
    {
      type: 'scatter',
      mode: 'lines',
      x: [0, 0],
      y: [-10, 10],
      line: { color: '#000000', width: 2 },
      name: 'y-axis'
    },
    // Student's sketch
    {
      x: sketchPoints.map(p => p.x),
      y: sketchPoints.map(p => p.y),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#4F46E5', width: 2.5 },
      name: 'השרטוט שלך'
    }
  ];

  // Add solution trace if enabled
  if (showSolution && solutionPoints.length > 0) {
    traces.push({
      x: solutionPoints.map(p => p.x),
      y: solutionPoints.map(p => p.y),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#22C55E', width: 2, dash: 'dot' },
      name: 'הפתרון'
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1 text-right">
          <h4 className="font-medium text-gray-900">{translations.sketchInstructions}</h4>
          <p className="text-sm text-gray-500">
            {isDrawing ? translations.sketchHintDrawing : translations.sketchHint}
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={clearSketch}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {translations.clearSketch}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <Plot
          data={traces}
          layout={{
            width,
            height,
            showlegend: false,
            xaxis: {
              range: xRange,
              zeroline: false,
              gridcolor: '#E5E7EB',
              zerolinecolor: '#000000',
              zerolinewidth: 2,
              fixedrange: true,
              showgrid: true,
              title: { text: '' },
              showticklabels: true,
              automargin: true,
              tickmode: 'array',
              ticktext: ['-10', '-5', '0', '5', '10'],
              tickvals: [-10, -5, 0, 5, 10]
            },
            yaxis: {
              range: yRange,
              zeroline: false,
              gridcolor: '#E5E7EB',
              zerolinecolor: '#000000',
              zerolinewidth: 2,
              fixedrange: true,
              showgrid: true,
              title: { text: '' },
              showticklabels: true,
              automargin: true,
              tickmode: 'array',
              ticktext: ['-10', '-5', '0', '5', '10'],
              tickvals: [-10, -5, 0, 5, 10]
            },
            dragmode: 'drawline',
            hovermode: 'closest',
            margin: { l: 50, r: 50, t: 0, b: 50 },
            plot_bgcolor: '#FFFFFF',
            paper_bgcolor: '#FFFFFF',
            modebar: { remove: ["autoScale2d", "resetScale2d"] }
          }}
          config={{
            displayModeBar: false,
            responsive: true,
            scrollZoom: false,
            editable: false,
            displaylogo: false,
            showAxisDragHandles: false,
            showAxisRangeEntryBoxes: false,
            showTips: false,
            plotlyServerURL: ''
          }}
          onClick={handlePlotClick}
          onHover={handleMouseMove}
          style={{
            width: '100%',
            height: '100%',
            cursor: isDrawing ? 'crosshair' : 'pointer'
          }}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <h5 className="font-medium text-blue-900 mb-2 text-right">{translations.drawingTips}</h5>
        <ul className="space-y-1 text-sm text-blue-800 text-right">
          <li>{translations.drawingTip1}</li>
          <li>{translations.drawingTip2}</li>
          <li>{translations.drawingTip3}</li>
        </ul>
      </div>
    </div>
  );
}; 