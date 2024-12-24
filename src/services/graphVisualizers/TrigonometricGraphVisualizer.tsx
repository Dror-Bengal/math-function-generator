import React from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { FunctionType, FunctionCharacteristics, CircleData } from '../../types/FunctionTypes';
import { BaseGraphVisualizer, GraphConfig } from './BaseGraphVisualizer';
import DebugLogger from '../../utils/debugLogger';

const IS_DEBUG = process.env.NODE_ENV === 'development';

export class TrigonometricGraphVisualizer extends BaseGraphVisualizer {
  plot(
    func: ((x: number) => number | undefined) | CircleData,
    characteristics: FunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ): JSX.Element {
    // Type guard to ensure we have a function
    if (typeof func !== 'function') {
      throw new Error('Trigonometric visualizer requires a function');
    }

    const mergedConfig: GraphConfig = {
      ...BaseGraphVisualizer.DEFAULT_CONFIG,
      width: 800,
      height: 500,
      xRange: [-2 * Math.PI, 2 * Math.PI], // Show at least two periods by default
      ...config
    };

    // Generate more points for smoother curves
    const points = BaseGraphVisualizer.generatePoints(
      func, 
      mergedConfig.xRange[0], 
      mergedConfig.xRange[1],
      mergedConfig.width * 2, // Double the points for smoother curves
      mergedConfig.xRange
    );
    
    // Get all special points
    const criticalPoints = characteristics.criticalPoints || [];
    const roots = characteristics.roots || [];
    const specialPoints = [...criticalPoints, ...roots];
    
    // Calculate y-range from points and special points
    let minY = specialPoints.length > 0 ? Math.min(...specialPoints.map(p => p.y)) : -5;
    let maxY = specialPoints.length > 0 ? Math.max(...specialPoints.map(p => p.y)) : 5;

    const yValues = points.map(p => p.y).filter(y => !isNaN(y) && isFinite(y));
    if (yValues.length > 0) {
      minY = Math.min(minY, ...yValues);
      maxY = Math.max(maxY, ...yValues);
    }

    // Add padding to y-range
    const range = maxY - minY;
    const padding = Math.min(range * 0.1, 2);
    minY = Math.max(minY - padding, -10);
    maxY = Math.min(maxY + padding, 10);

    // Ensure zero is visible if function has roots
    if (minY > 0 && roots.length > 0) minY = -1;
    if (maxY < 0 && roots.length > 0) maxY = 1;

    mergedConfig.yRange = [minY, maxY];

    // Debug logging
    if (IS_DEBUG) {
      let expression = `f(x) = ${func.toString()}`;
      if ('points' in characteristics) {
        const points = (characteristics as any).points;
        if (Array.isArray(points) && points.length >= 4) {
          const [a, b, c, d] = points;
          expression = `f(x) = ${a}sin(${b}x ${c >= 0 ? '+' : ''}${c}) ${d >= 0 ? '+' : ''}${d}`;
        }
      }

      DebugLogger.logFunction({
        type: FunctionType.TRIGONOMETRIC,
        expression,
        characteristics,
        points: []
      });
      DebugLogger.logPoints(points);
      DebugLogger.logGraph({
        ...mergedConfig,
        functionType: FunctionType.TRIGONOMETRIC,
        calculatedYRange: [minY, maxY]
      });
    }

    // Create traces array starting with the main function
    const traces: Partial<PlotData>[] = [
      {
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        type: 'scatter',
        mode: 'lines',
        line: { color: '#4F46E5', width: 2 }
      }
    ];

    // Add period markers if available
    if (characteristics.period) {
      const period = characteristics.period;
      const numPeriods = Math.floor((mergedConfig.xRange[1] - mergedConfig.xRange[0]) / period);
      const periodMarkers: Point[] = [];

      for (let i = 0; i <= numPeriods; i++) {
        const x = mergedConfig.xRange[0] + i * period;
        if (x <= mergedConfig.xRange[1]) {
          periodMarkers.push({ x, y: 0 });
        }
      }

      traces.push({
        x: periodMarkers.map(p => p.x),
        y: periodMarkers.map(() => minY),
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: '#9333EA',
          size: 8,
          symbol: 'triangle-up'
        },
        showlegend: false,
        hoverinfo: 'text',
        hovertext: periodMarkers.map(p => `Period: x = ${p.x.toFixed(2)}`)
      });
    }

    // Add intersection points if enabled
    if (mergedConfig.showIntersectionPoints && roots.length > 0) {
      traces.push({
        x: roots.map(p => p.x),
        y: roots.map(p => p.y),
        type: 'scatter',
        mode: 'text+markers',
        marker: {
          color: '#EF4444',
          size: 8,
          symbol: 'circle'
        },
        text: roots.map(p => `(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`),
        textposition: 'top center',
        showlegend: false,
        hoverinfo: 'text',
        hovertext: roots.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`)
      });
    }

    // Add critical points (maxima, minima)
    if (criticalPoints.length > 0) {
      traces.push({
        x: criticalPoints.map(p => p.x),
        y: criticalPoints.map(p => p.y),
        type: 'scatter',
        mode: 'text+markers',
        marker: {
          color: '#3B82F6',
          size: 8,
          symbol: 'circle'
        },
        text: criticalPoints.map(p => `(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`),
        textposition: 'top center',
        showlegend: false,
        hoverinfo: 'text',
        hovertext: criticalPoints.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`)
      });
    }

    // Customize layout for trigonometric functions
    const layout = BaseGraphVisualizer.createBaseLayout(mergedConfig);
    layout.xaxis = {
      ...layout.xaxis,
      tickmode: 'array',
      ticktext: ['−2π', '−3π/2', '−π', '−π/2', '0', 'π/2', 'π', '3π/2', '2π'],
      tickvals: [
        -2 * Math.PI,
        -3 * Math.PI / 2,
        -Math.PI,
        -Math.PI / 2,
        0,
        Math.PI / 2,
        Math.PI,
        3 * Math.PI / 2,
        2 * Math.PI
      ]
    };

    return (
      <div style={BaseGraphVisualizer.createGraphContainer()}>
        <Plot
          data={traces}
          layout={layout}
          config={{
            displayModeBar: false,
            responsive: true,
            scrollZoom: true
          }}
          style={{
            width: '100%',
            height: '100%'
          }}
          useResizeHandler={true}
        />
      </div>
    );
  }
} 