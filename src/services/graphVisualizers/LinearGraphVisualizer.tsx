import React from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { FunctionType, FunctionCharacteristics, LinearFunctionCharacteristics, CircleData } from '../../types/FunctionTypes';
import { BaseGraphVisualizer, GraphConfig } from './BaseGraphVisualizer';
import DebugLogger from '../../utils/debugLogger';

const IS_DEBUG = process.env.NODE_ENV === 'development';

export class LinearGraphVisualizer extends BaseGraphVisualizer {
  plot(
    func: ((x: number) => number | undefined) | CircleData,
    characteristics: FunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ): JSX.Element {
    // Type guard to ensure we have a function
    if (typeof func !== 'function') {
      throw new Error('Linear visualizer requires a function');
    }

    const mergedConfig: GraphConfig = {
      ...BaseGraphVisualizer.DEFAULT_CONFIG,
      width: 800,
      height: 500,
      xRange: [-5, 5],
      ...config
    };

    const points = BaseGraphVisualizer.generatePoints(
      func, 
      mergedConfig.xRange[0], 
      mergedConfig.xRange[1],
      mergedConfig.width,
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
        if (Array.isArray(points) && points.length >= 2) {
          const [m, b] = points;
          expression = `f(x) = ${m}x ${b >= 0 ? '+' : ''}${b}`;
        }
      }

      DebugLogger.logFunction({
        type: FunctionType.LINEAR,
        expression,
        characteristics,
        points: []
      });
      DebugLogger.logPoints(points);
      DebugLogger.logGraph({
        ...mergedConfig,
        functionType: FunctionType.LINEAR,
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

    // Add sign intervals if available
    const linearCharacteristics = characteristics as LinearFunctionCharacteristics;
    if (linearCharacteristics.signIntervals) {
      const { positive, negative, zero } = linearCharacteristics.signIntervals;

      // Add positive interval indicators
      positive.forEach(interval => {
        const [start, end] = LinearGraphVisualizer.parseInterval(interval);
        traces.push({
          x: [start, end].map(x => LinearGraphVisualizer.clipToRange(x, mergedConfig.xRange)),
          y: [maxY * 0.95, maxY * 0.95],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#22C55E', width: 4 },
          hoverinfo: 'text',
          hovertext: `f(x) > 0 for x ∈ ${interval}`,
          hoverlabel: {
            bgcolor: '#22C55E',
            font: { color: '#FFFFFF' }
          }
        });
      });

      // Add negative interval indicators
      negative.forEach(interval => {
        const [start, end] = LinearGraphVisualizer.parseInterval(interval);
        traces.push({
          x: [start, end].map(x => LinearGraphVisualizer.clipToRange(x, mergedConfig.xRange)),
          y: [minY * 0.95, minY * 0.95],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#EF4444', width: 4 },
          hoverinfo: 'text',
          hovertext: `f(x) < 0 for x ∈ ${interval}`,
          hoverlabel: {
            bgcolor: '#EF4444',
            font: { color: '#FFFFFF' }
          }
        });
      });

      // Add zero points
      if (zero.length > 0) {
        traces.push({
          x: zero.map(p => p.x),
          y: zero.map(p => p.y),
          type: 'scatter',
          mode: 'markers',
          marker: {
            color: '#6B7280',
            size: 10,
            symbol: 'circle'
          },
          hoverinfo: 'text',
          hovertext: zero.map(p => `f(${p.x.toFixed(2)}) = 0`),
          hoverlabel: {
            bgcolor: '#6B7280',
            font: { color: '#FFFFFF' }
          }
        });
      }
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

    const layout = BaseGraphVisualizer.createBaseLayout(mergedConfig);

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

  private static parseInterval(interval: string): [number, number] {
    const matches = interval.match(/[\d.-]+/g);
    if (interval.includes('∞')) {
      if (interval.startsWith('(')) {
        return [parseFloat(matches?.[0] || '0'), 1000];
      } else {
        return [-1000, parseFloat(matches?.[0] || '0')];
      }
    }
    return [
      parseFloat(matches?.[0] || '0'),
      parseFloat(matches?.[1] || '0')
    ];
  }

  private static clipToRange(value: number, range: [number, number]): number {
    return Math.max(range[0], Math.min(range[1], value));
  }
} 