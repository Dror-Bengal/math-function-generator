import React from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { FunctionType, FunctionCharacteristics, CircleData, Point } from '../../types/FunctionTypes';
import { BaseGraphVisualizer, GraphConfig } from './BaseGraphVisualizer';
import DebugLogger from '../../utils/debugLogger';

const IS_DEBUG = process.env.NODE_ENV === 'development';

export class LinearGraphVisualizer extends BaseGraphVisualizer {
  private static createHoverLabel(color: string) {
    return {
      bgcolor: color,
      font: { color: '#FFFFFF', size: 14 }
    };
  }

  private static createPointTrace(points: Point[]) {
    return {
      x: points.map(p => p.x),
      y: points.map(p => p.y)
    };
  }

  private static formatInterval(interval: string) {
    return interval
      .replace(/([0-9.-]+)/g, num => parseFloat(num).toFixed(2))
      .replace('∞', 'אינסוף')
      .replace('-אינסוף', '−אינסוף');
  }

  private static formatPoint(p: Point): string {
    return `\u202B(${p.x.toFixed(2)}, ${p.y.toFixed(2)})\u202C`;
  }

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
      const slope = (characteristics as any).slope;
      const yIntercept = (characteristics as any).yIntercept;
      const expression = `f(x) = ${slope}x ${yIntercept >= 0 ? '+' : ''}${yIntercept}`;

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

    // Create traces
    const traces: Partial<PlotData>[] = [
      {
        ...LinearGraphVisualizer.createPointTrace(points),
        type: 'scatter',
        mode: 'lines',
        line: { color: '#4F46E5', width: 2 }
      }
    ];

    // Add sign intervals visualization
    const signIntervals = (characteristics as any).signIntervals;
    if (signIntervals) {
      // Add positive intervals
      if (signIntervals.positive.length > 0) {
        traces.push({
          ...LinearGraphVisualizer.createPointTrace(points),
          type: 'scatter',
          mode: 'none',
          fill: 'tonexty',
          fillcolor: 'rgba(34, 197, 94, 0.1)', // Light green
          showlegend: false,
          hoverinfo: 'text',
          hovertext: `\u202Bהתחום שבו הפונקציה חיובית: ${signIntervals.positive.map(LinearGraphVisualizer.formatInterval).join(', ')}\u202C`,
          hoverlabel: LinearGraphVisualizer.createHoverLabel('rgba(34, 197, 94, 0.9)')
        });
      }

      // Add negative intervals
      if (signIntervals.negative.length > 0) {
        traces.push({
          ...LinearGraphVisualizer.createPointTrace(points),
          type: 'scatter',
          mode: 'none',
          fill: 'tonexty',
          fillcolor: 'rgba(239, 68, 68, 0.1)', // Light red
          showlegend: false,
          hoverinfo: 'text',
          hovertext: `\u202Bהתחום שבו הפונקציה שלילית: ${signIntervals.negative.map(LinearGraphVisualizer.formatInterval).join(', ')}\u202C`,
          hoverlabel: LinearGraphVisualizer.createHoverLabel('rgba(239, 68, 68, 0.9)')
        });
      }

      // Add zero points
      if (signIntervals.zero.length > 0) {
        traces.push({
          ...LinearGraphVisualizer.createPointTrace(signIntervals.zero),
          type: 'scatter',
          mode: 'text+markers',
          marker: {
            color: '#6B7280',
            size: 10,
            symbol: 'circle-dot'
          },
          text: signIntervals.zero.map((p: Point) => LinearGraphVisualizer.formatPoint(p)),
          textposition: 'top center',
          showlegend: false,
          hoverinfo: 'text',
          hovertext: signIntervals.zero.map((p: Point) => 
            `\u202Bנקודת אפס: ${LinearGraphVisualizer.formatPoint(p)}\u202C`
          ),
          hoverlabel: LinearGraphVisualizer.createHoverLabel('rgba(107, 114, 128, 0.9)')
        });
      }
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
            scrollZoom: true,
            // Enhanced mobile touch support
            modeBarButtonsToRemove: ['select2d', 'lasso2d'],
            displaylogo: false,
            showTips: true,
            // Touch interaction settings
            staticPlot: false,
            toImageButtonOptions: {
              format: 'png',
              filename: 'graph',
              height: 500,
              width: 800,
              scale: 2
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            touchAction: 'pan-y pinch-zoom'
          }}
          useResizeHandler={true}
        />
      </div>
    );
  }
} 