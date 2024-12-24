import React from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { FunctionType, FunctionCharacteristics, CircleData } from '../../types/FunctionTypes';
import { BaseGraphVisualizer, GraphConfig } from './BaseGraphVisualizer';
import DebugLogger from '../../utils/debugLogger';

const IS_DEBUG = process.env.NODE_ENV === 'development';

export class RationalGraphVisualizer extends BaseGraphVisualizer {
  plot(
    func: ((x: number) => number | undefined) | CircleData,
    characteristics: FunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ): JSX.Element {
    // Type guard to ensure we have a function
    if (typeof func !== 'function') {
      throw new Error('Rational visualizer requires a function');
    }

    const mergedConfig: GraphConfig = {
      ...BaseGraphVisualizer.DEFAULT_CONFIG,
      width: 800,
      height: 500,
      xRange: [-5, 5],
      ...config
    };

    // Generate more points for smoother curves around asymptotes
    const points = BaseGraphVisualizer.generatePoints(
      func, 
      mergedConfig.xRange[0], 
      mergedConfig.xRange[1],
      mergedConfig.width * 3, // Triple the points for better asymptote handling
      mergedConfig.xRange
    );
    
    // Get all special points
    const criticalPoints = characteristics.criticalPoints || [];
    const roots = characteristics.roots || [];
    const asymptotes = characteristics.asymptotes || [];
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
        if (Array.isArray(points)) {
          const n = points.length;
          const mid = Math.floor(n / 2);
          const numerator = points.slice(0, mid);
          const denominator = points.slice(mid);

          const formatPolynomial = (coeffs: number[]) => 
            coeffs.map((coeff, i) => {
              const power = coeffs.length - i - 1;
              if (coeff === 0) return '';
              const term = power === 0 ? `${coeff}` :
                          power === 1 ? `${coeff}x` :
                          `${coeff}x^${power}`;
              return (coeff >= 0 && i !== 0 ? '+' : '') + term;
            }).filter(term => term !== '').join('') || '0';

          expression = `f(x) = (${formatPolynomial(numerator)})/(${formatPolynomial(denominator)})`;
        }
      }

      DebugLogger.logFunction({
        type: FunctionType.RATIONAL,
        expression,
        characteristics,
        points: []
      });
      DebugLogger.logPoints(points);
      DebugLogger.logGraph({
        ...mergedConfig,
        functionType: FunctionType.RATIONAL,
        calculatedYRange: [minY, maxY]
      });
    }

    // Create traces array starting with the main function
    const traces: Partial<PlotData>[] = [];

    // Split points into continuous segments (handling asymptotes)
    const segments: Point[][] = [];
    let currentSegment: Point[] = [];
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      
      if (point.y !== undefined && Math.abs(point.y) <= 10) {
        currentSegment.push(point);
        
        // Check for discontinuity
        if (nextPoint && (
          nextPoint.y === undefined ||
          Math.abs(nextPoint.y) > 10 ||
          Math.abs(nextPoint.y - point.y) > 5
        )) {
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
          }
        }
      } else if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }
    
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    // Add each continuous segment as a separate trace
    segments.forEach(segment => {
      traces.push({
        x: segment.map(p => p.x),
        y: segment.map(p => p.y),
        type: 'scatter',
        mode: 'lines',
        line: { color: '#4F46E5', width: 2 },
        connectgaps: false
      });
    });

    // Add asymptotes if available
    if (asymptotes && asymptotes.length > 0) {
      asymptotes.forEach(asymptote => {
        if (asymptote.type === 'vertical') {
          traces.push({
            x: [asymptote.value, asymptote.value],
            y: [minY, maxY],
            type: 'scatter',
            mode: 'lines',
            line: { color: '#DC2626', width: 1, dash: 'dash' },
            hoverinfo: 'text',
            hovertext: `x = ${asymptote.value}`
          });
        } else if (asymptote.type === 'horizontal') {
          traces.push({
            x: [mergedConfig.xRange[0], mergedConfig.xRange[1]],
            y: [asymptote.value, asymptote.value],
            type: 'scatter',
            mode: 'lines',
            line: { color: '#DC2626', width: 1, dash: 'dash' },
            hoverinfo: 'text',
            hovertext: `y = ${asymptote.value}`
          });
        }
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

    // Add critical points
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
} 