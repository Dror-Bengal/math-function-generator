import React from 'react';
import { Point, FunctionCharacteristics, CircleData } from '../types/FunctionTypes';
import Plot from 'react-plotly.js';
import DebugLogger from '../utils/debugLogger';
import { PlotData, Layout as PlotlyLayout } from 'plotly.js';

interface GraphConfig {
  width: number;
  height: number;
  padding: number;
  xRange: [number, number];
  yRange: [number, number];
  gridStep: number;
  showGrid: boolean;
  showLabels: boolean;
  fontSize: number;
  isInteractive: boolean;
  showHints: boolean;
  showIntersectionPoints?: boolean;
  grid: {
    show: boolean;
    color: string;
    drawBorder: boolean;
  };
  xaxis: {
    title: {
      text: string;
      style: {
        fontSize: string;
        fontWeight?: string;
      }
    };
    tickAmount: number;
    labels: {
      formatter: (value: number) => string;
    }
  };
  yaxis: {
    title: {
      text: string;
      style: {
        fontSize: string;
        fontWeight?: string;
      }
    };
    tickAmount: number;
    labels: {
      formatter: (value: number) => string;
    }
  }
}

// Add debug mode constant
const IS_DEBUG = process.env.NODE_ENV === 'development';

export class GraphVisualizer {
  private static readonly DEFAULT_CONFIG: GraphConfig = {
    width: 800,
    height: 600,
    padding: 40,
    xRange: [-10, 10],
    yRange: [-10, 10],
    gridStep: 1,
    showGrid: true,
    showLabels: true,
    fontSize: 14,
    isInteractive: true,
    showHints: true,
    showIntersectionPoints: true,
    grid: {
      show: true,
      color: '#e0e0e0',
      drawBorder: true,
    },
    xaxis: {
      title: {
        text: 'ציר x',
        style: {
          fontSize: '16px',
          fontWeight: '600'
        }
      },
      tickAmount: 10,
      labels: {
        formatter: (value: number) => value.toFixed(1)
      }
    },
    yaxis: {
      title: {
        text: 'ציר y',
        style: {
          fontSize: '16px',
          fontWeight: '600'
        }
      },
      tickAmount: 10,
      labels: {
        formatter: (value: number) => value.toFixed(1)
      }
    }
  };

  static plot(
    func: (x: number) => number | undefined,
    characteristics: FunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ): JSX.Element {
    const mergedConfig: GraphConfig = {
      ...this.DEFAULT_CONFIG,
      width: 800,
      height: 500,
      xRange: [-5, 5],
      ...config
    };

    const points = this.generatePoints(
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
    
    // Calculate initial y-range from special points
    let minY = specialPoints.length > 0 ? Math.min(...specialPoints.map(p => p.y)) : -5;
    let maxY = specialPoints.length > 0 ? Math.max(...specialPoints.map(p => p.y)) : 5;

    // Add points data to range calculation
    const yValues = points.map(p => p.y).filter(y => !isNaN(y) && isFinite(y));
    if (yValues.length > 0) {
      minY = Math.min(minY, ...yValues);
      maxY = Math.max(maxY, ...yValues);
    }

    // Ensure reasonable limits with some padding
    const range = maxY - minY;
    const padding = Math.min(range * 0.1, 2);
    
    minY = Math.max(minY - padding, -10);
    maxY = Math.min(maxY + padding, 10);

    // Ensure zero is visible if function has intersection points
    if (minY > 0 && roots.length > 0) minY = -1;
    if (maxY < 0 && roots.length > 0) maxY = 1;

    // Update merged config with calculated y-range
    mergedConfig.yRange = [minY, maxY];

    // Only log in debug mode
    if (IS_DEBUG) {
      DebugLogger.logPoints(points);
      DebugLogger.logGraph({
        ...mergedConfig,
        functionType: characteristics.type || 'unknown',
        calculatedYRange: [minY, maxY]
      });
    }

    // Create the main function trace
    const functionTrace: Partial<PlotData> = {
      x: points.map(p => p.x),
      y: points.map(p => p.y),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#4F46E5', width: 2 }
    };

    // Create intersection points trace if enabled
    const intersectionTrace: Partial<PlotData> = {
      x: roots.map((p: Point) => p.x),
      y: roots.map((p: Point) => p.y),
      type: 'scatter',
      mode: 'text+markers',
      marker: {
        color: '#EF4444',
        size: 8,
        symbol: 'circle'
      },
      text: roots.map((p: Point) => `(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`),
      textposition: 'top center',
      showlegend: false,
      hoverinfo: 'text',
      hovertext: roots.map((p: Point) => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`)
    };

    // Create critical points trace
    const criticalTrace: Partial<PlotData> = {
      x: criticalPoints.map(p => p.x),
      y: criticalPoints.map(p => p.y),
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: '#3B82F6',
        size: 8,
        symbol: 'circle'
      },
      showlegend: false,
      hoverinfo: 'text',
      hovertext: criticalPoints.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`)
    };

    const layout: Partial<PlotlyLayout> = {
      width: mergedConfig.width,
      height: mergedConfig.height,
      autosize: true,
      margin: { l: 60, r: 50, t: 50, b: 60 },
      title: 'גרף הפונקציה',
      xaxis: {
        range: mergedConfig.xRange,
        zeroline: true,
        zerolinecolor: '#1f2937',
        zerolinewidth: 2,
        gridcolor: '#9ca3af',
        gridwidth: 1,
        showgrid: true,
        title: {
          text: 'ציר x',
          font: {
            size: 18,
            weight: 600,
            family: 'Heebo, sans-serif'
          },
          standoff: 25
        },
        tickfont: {
          size: 14,
          family: 'Heebo, sans-serif'
        },
        tickmode: 'linear',
        dtick: 2,
        minor: {
          ticklen: 4,
          tickwidth: 1,
          dtick: 1,
          showgrid: true,
          gridcolor: '#e5e7eb'
        }
      },
      yaxis: {
        range: mergedConfig.yRange,
        zeroline: true,
        zerolinecolor: '#1f2937',
        zerolinewidth: 2,
        gridcolor: '#9ca3af',
        gridwidth: 1,
        showgrid: true,
        title: {
          text: 'ציר y',
          font: {
            size: 18,
            weight: 600,
            family: 'Heebo, sans-serif'
          },
          standoff: 25
        },
        tickfont: {
          size: 14,
          family: 'Heebo, sans-serif'
        },
        tickmode: 'linear',
        dtick: 2,
        minor: {
          ticklen: 4,
          tickwidth: 1,
          dtick: 1,
          showgrid: true,
          gridcolor: '#e5e7eb'
        },
        scaleanchor: 'x',
        scaleratio: 1
      },
      showlegend: false,
      plot_bgcolor: '#fff',
      paper_bgcolor: '#fff',
      font: {
        family: 'Heebo, sans-serif',
        size: 14
      }
    };

    // Only log in debug mode
    if (IS_DEBUG) {
      DebugLogger.logLayout(layout);
    }

    const traces = [functionTrace];
    if (mergedConfig.showIntersectionPoints) {
      traces.push(intersectionTrace);
    }
    if (criticalPoints.length > 0) {
      traces.push(criticalTrace);
    }

    return (
      <div style={{ 
        width: '100%',
        height: '500px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}>
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

  private static generatePoints(
    func: (x: number) => number | undefined,
    start: number,
    end: number,
    graphWidth: number,
    xRange: [number, number]
  ): Point[] {
    const xScale = graphWidth / (xRange[1] - xRange[0]);
    const numPoints = Math.floor(xScale * (end - start));
    
    const result: Point[] = [];
    let lastValidY: number | undefined;
    
    for (let i = 0; i < numPoints; i++) {
      const x = start + (i * (end - start)) / (numPoints - 1);
      const y = func(x);
      
      if (y !== undefined && !isNaN(y) && isFinite(y)) {
        if (Math.abs(y) > 10) {
          if (lastValidY !== undefined && Math.abs(lastValidY) <= 10) {
            const interpolatedX = x - ((end - start) / (numPoints - 1)) / 2;
            const interpolatedY = (lastValidY + 10 * Math.sign(y)) / 2;
            result.push({ x: interpolatedX, y: interpolatedY });
          }
          result.push({ x, y: 10 * Math.sign(y) });
        } else {
          result.push({ x, y });
          lastValidY = y;
        }
      }
    }
    
    return result;
  }

  static createCircleGraph(
    circleData: CircleData | any,
    config: Partial<GraphConfig> = {}
  ) {
    // Handle case where center and radius are in characteristics
    const processedCircleData: CircleData = {
      ...circleData,
      center: circleData.center || circleData.characteristics?.center || { x: 0, y: 0 },
      radius: circleData.radius || circleData.characteristics?.radius || 1,
      type: circleData.type,
      expression: circleData.expression,
      points: circleData.points,
      characteristics: circleData.characteristics,
      equation: circleData.equation || circleData.expression,
      intersectionPoints: circleData.intersectionPoints || circleData.characteristics?.xIntersections || [],
      tangentPoints: circleData.tangentPoints || []
    };

    if (!processedCircleData.center || !processedCircleData.radius) {
      console.error('Invalid circle data:', circleData);
      return null;
    }

    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    // Create circle-specific layout
    const circleLayout: Partial<PlotlyLayout> = {
      width: fullConfig.width,
      height: fullConfig.height,
      autosize: true,
      margin: { l: 60, r: 50, t: 50, b: 60 },
      title: 'גרף הפונקציה',
      xaxis: {
        zeroline: true,
        zerolinecolor: '#1f2937',
        zerolinewidth: 2,
        gridcolor: '#9ca3af',
        gridwidth: 1,
        showgrid: true,
        title: {
          text: 'ציר x',
          font: {
            size: 18,
            weight: 600,
            family: 'Heebo, sans-serif'
          },
          standoff: 25
        },
        tickfont: {
          size: 14,
          family: 'Heebo, sans-serif'
        },
        tickmode: 'linear',
        dtick: 2,
        minor: {
          ticklen: 4,
          tickwidth: 1,
          dtick: 1,
          showgrid: true,
          gridcolor: '#e5e7eb'
        },
        range: [
          processedCircleData.center.x - processedCircleData.radius * 1.2,
          processedCircleData.center.x + processedCircleData.radius * 1.2
        ]
      },
      yaxis: {
        zeroline: true,
        zerolinecolor: '#1f2937',
        zerolinewidth: 2,
        gridcolor: '#9ca3af',
        gridwidth: 1,
        showgrid: true,
        title: {
          text: 'ציר y',
          font: {
            size: 18,
            weight: 600,
            family: 'Heebo, sans-serif'
          },
          standoff: 25
        },
        tickfont: {
          size: 14,
          family: 'Heebo, sans-serif'
        },
        tickmode: 'linear',
        dtick: 2,
        minor: {
          ticklen: 4,
          tickwidth: 1,
          dtick: 1,
          showgrid: true,
          gridcolor: '#e5e7eb'
        },
        scaleanchor: 'x',
        scaleratio: 1,
        range: [
          processedCircleData.center.y - processedCircleData.radius * 1.2,
          processedCircleData.center.y + processedCircleData.radius * 1.2
        ]
      },
      showlegend: false,
      plot_bgcolor: '#fff',
      paper_bgcolor: '#fff',
      font: {
        family: 'Heebo, sans-serif',
        size: 14
      }
    };
    
    return (
      <div style={{ 
        width: '100%',
        height: '500px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}>
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines',
            x: this.generateCirclePoints(processedCircleData).x,
            y: this.generateCirclePoints(processedCircleData).y,
            line: { color: '#4F46E5', width: 2 }
          }]}
          layout={circleLayout}
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

  private static generateCirclePoints(circleData: CircleData) {
    const points = 100;
    const x = [];
    const y = [];
    
    for (let i = 0; i <= points; i++) {
      const angle = (2 * Math.PI * i) / points;
      x.push(circleData.center.x + circleData.radius * Math.cos(angle));
      y.push(circleData.center.y + circleData.radius * Math.sin(angle));
    }
    
    return { x, y };
  }
} 