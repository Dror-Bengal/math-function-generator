import React from 'react';
import { Point, FunctionCharacteristics, CircleData, FunctionTypeString } from '../types/FunctionTypes';
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
      }
    };
    tickAmount: number;
    labels: {
      formatter: (value: number) => string;
    }
  }
}

interface ExtendedFunctionCharacteristics extends FunctionCharacteristics {
  type?: FunctionTypeString;
}

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
    fontSize: 12,
    isInteractive: true,
    showHints: true,
    grid: {
      show: true,
      color: '#e0e0e0',
      drawBorder: true,
    },
    xaxis: {
      title: {
        text: 'x',
        style: {
          fontSize: '14px',
        }
      },
      tickAmount: 10,
      labels: {
        formatter: (value: number) => value.toFixed(1)
      }
    },
    yaxis: {
      title: {
        text: 'y',
        style: {
          fontSize: '14px',
        }
      },
      tickAmount: 10,
      labels: {
        formatter: (value: number) => value.toFixed(1)
      }
    }
  };

  static createGraph(
    func: (x: number) => number | undefined,
    characteristics: ExtendedFunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ): JSX.Element {
    // Merge with default config to ensure all properties are defined
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
    
    // Get the special points first
    const criticalPoints = characteristics.criticalPoints || [];
    const roots = characteristics.roots || [];
    const inflectionPoints = characteristics.inflectionPoints || [];
    const specialPoints = [...criticalPoints, ...roots, ...inflectionPoints];
    
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

    // Ensure zero is visible if function crosses x-axis
    if (minY > 0 && roots.length > 0) minY = -1;
    if (maxY < 0 && roots.length > 0) maxY = 1;

    // Update merged config with calculated y-range
    mergedConfig.yRange = [minY, maxY];

    // Log with explicit function type
    DebugLogger.logPoints(points);
    DebugLogger.logGraph({
      ...mergedConfig,
      functionType: characteristics.type || 'unknown',
      calculatedYRange: [minY, maxY]
    });

    const trace: Partial<PlotData> = {
      x: points.map(p => p.x),
      y: points.map(p => p.y),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#4F46E5', width: 2 }
    };

    const layout: Partial<PlotlyLayout> = {
      width: mergedConfig.width,
      height: mergedConfig.height,
      autosize: true,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      title: 'גרף הפונקציה',
      xaxis: {
        range: mergedConfig.xRange,
        zeroline: true,
        zerolinecolor: '#666',
        gridcolor: '#e0e0e0',
        showgrid: true,
        title: {
          text: 'x',
          standoff: 10
        }
      },
      yaxis: {
        range: mergedConfig.yRange,
        zeroline: true,
        zerolinecolor: '#666',
        gridcolor: '#e0e0e0',
        showgrid: true,
        title: {
          text: 'y',
          standoff: 10
        }
      },
      showlegend: false,
      plot_bgcolor: '#fff',
      paper_bgcolor: '#fff'
    };

    DebugLogger.logLayout(layout);

    const plotProps = {
      data: [trace],
      layout,
      config: {
        displayModeBar: false,
        responsive: true,
        scrollZoom: true
      },
      style: {
        width: '100%',
        height: '100%'
      },
      useResizeHandler: true
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
        <Plot {...plotProps} />
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
    
    return (
      <svg 
        className="w-full h-full"
        viewBox={`0 0 ${fullConfig.width} ${fullConfig.height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Grid and Axes */}
        {this.renderGrid(fullConfig)}
        {this.renderAxes(fullConfig)}
        
        {/* Circle */}
        {this.renderCircle(processedCircleData, fullConfig)}
        
        {/* Special Points */}
        {this.renderCirclePoints(processedCircleData, fullConfig)}
        
        {/* Intersection Points */}
        {processedCircleData.intersectionPoints && processedCircleData.intersectionPoints.length > 0 && 
          this.renderIntersectionPoints(processedCircleData.intersectionPoints, fullConfig)}
        
        {/* Tangent Lines */}
        {processedCircleData.characteristics?.tangentLines && 
          this.renderTangentLines(processedCircleData.characteristics, fullConfig)}
      </svg>
    );
  }

  private static renderGrid(config: GraphConfig) {
    const gridLines = [];
    const step = 1;
    
    // Vertical grid lines
    for (let x = config.xRange[0]; x <= config.xRange[1]; x += step) {
      const xPos = this.mapX(x, config);
      gridLines.push(
        <line
          key={`grid-v-${x}`}
          x1={xPos}
          y1={0}
          x2={xPos}
          y2={config.height}
          className="grid-line"
          strokeDasharray="4 4"
        />
      );
    }
    
    // Horizontal grid lines
    for (let y = config.yRange[0]; y <= config.yRange[1]; y += step) {
      const yPos = this.mapY(y, config);
      gridLines.push(
        <line
          key={`grid-h-${y}`}
          x1={0}
          y1={yPos}
          x2={config.width}
          y2={yPos}
          className="grid-line"
          strokeDasharray="4 4"
        />
      );
    }
    
    return <g className="grid">{gridLines}</g>;
  }

  private static renderAxes(config: GraphConfig) {
    const origin = {
      x: this.mapX(0, config),
      y: this.mapY(0, config)
    };

    return (
      <g className="axes">
        {/* X-axis */}
        <line
          x1={0}
          y1={origin.y}
          x2={config.width}
          y2={origin.y}
          className="axis-line"
        />
        {/* Y-axis */}
        <line
          x1={origin.x}
          y1={0}
          x2={origin.x}
          y2={config.height}
          className="axis-line"
        />
        {/* Axis labels */}
        {this.renderAxisLabels(config)}
      </g>
    );
  }

  private static renderAxisLabels(config: GraphConfig) {
    const labels = [];
    const step = 1;
    
    // X-axis labels
    for (let x = config.xRange[0]; x <= config.xRange[1]; x += step) {
      if (x === 0) continue; // Skip 0 as it's the origin
      labels.push(
        <text
          key={`label-x-${x}`}
          x={this.mapX(x, config)}
          y={this.mapY(0, config) + 20}
          textAnchor="middle"
          className="axis-label"
        >
          {x}
        </text>
      );
    }
    
    // Y-axis labels
    for (let y = config.yRange[0]; y <= config.yRange[1]; y += step) {
      if (y === 0) continue; // Skip 0 as it's the origin
      labels.push(
        <text
          key={`label-y-${y}`}
          x={this.mapX(0, config) - 20}
          y={this.mapY(y, config)}
          textAnchor="end"
          dominantBaseline="middle"
          className="axis-label"
        >
          {y}
        </text>
      );
    }
    
    return <g className="axis-labels">{labels}</g>;
  }

  private static renderCircle(circleData: CircleData, config: GraphConfig) {
    if (!circleData || !circleData.center) {
      console.error('Invalid circle data:', circleData);
      return null;
    }

    const { center, radius } = circleData;
    const cx = this.mapX(center.x, config);
    const cy = this.mapY(center.y, config);
    const r = radius * ((config.width - 2 * config.padding) / (config.xRange[1] - config.xRange[0]));

    return (
      <g className="circle">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="circle-path"
        />
        {/* Center point */}
        <circle
          cx={cx}
          cy={cy}
          r="3"
          fill="#3b82f6"
          className="center-point"
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          className="point-label"
        >
          O({center.x}, {center.y})
        </text>
      </g>
    );
  }

  private static renderCirclePoints(circleData: CircleData, config: GraphConfig) {
    if (!circleData || !circleData.center || !circleData.radius) {
      return null;
    }

    const { center, radius } = circleData;
    const points = [
      { x: center.x + radius, y: center.y }, // Right
      { x: center.x - radius, y: center.y }, // Left
      { x: center.x, y: center.y + radius }, // Top
      { x: center.x, y: center.y - radius }  // Bottom
    ];

    return (
      <g className="circle-points">
        {points.map((point, index) => (
          <g key={`point-${index}`} className="special-point">
            <circle
              cx={this.mapX(point.x, config)}
              cy={this.mapY(point.y, config)}
              r="3"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text
              x={this.mapX(point.x, config)}
              y={this.mapY(point.y, config) - 10}
              textAnchor="middle"
              className="point-label"
            >
              ({point.x}, {point.y})
            </text>
          </g>
        ))}
      </g>
    );
  }

  private static renderIntersectionPoints(points: Point[], config: GraphConfig) {
    return (
      <g className="intersection-points">
        {points.map((point, index) => (
          <g key={`intersection-${index}`} className="special-point">
            <circle
              cx={this.mapX(point.x, config)}
              cy={this.mapY(point.y, config)}
              r="3"
              fill="white"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <text
              x={this.mapX(point.x, config)}
              y={this.mapY(point.y, config) - 10}
              textAnchor="middle"
              className="point-label"
            >
              ({point.x.toFixed(1)}, {point.y.toFixed(1)})
            </text>
          </g>
        ))}
      </g>
    );
  }

  private static renderTangentLines(
    characteristics: FunctionCharacteristics,
    config: GraphConfig
  ) {
    if (!characteristics.tangentLines) return null;

    return (
      <g className="tangent-lines">
        {characteristics.tangentLines.map((line, index) => {
          const x1 = line.point.x - 5;
          const x2 = line.point.x + 5;
          const y1 = line.point.y - line.slope * 5;
          const y2 = line.point.y + line.slope * 5;

          return (
            <g key={`tangent-${index}`}>
              <line
                x1={this.mapX(x1, config)}
                y1={this.mapY(y1, config)}
                x2={this.mapX(x2, config)}
                y2={this.mapY(y2, config)}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle
                cx={this.mapX(line.point.x, config)}
                cy={this.mapY(line.point.y, config)}
                r="3"
                fill="white"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            </g>
          );
        })}
      </g>
    );
  }

  private static mapX(x: number, config: GraphConfig): number {
    return (
      ((x - config.xRange[0]) / (config.xRange[1] - config.xRange[0])) *
      (config.width - 2 * config.padding) +
      config.padding
    );
  }

  private static mapY(y: number, config: GraphConfig): number {
    return (
      config.height -
      (((y - config.yRange[0]) / (config.yRange[1] - config.yRange[0])) *
      (config.height - 2 * config.padding) +
      config.padding)
    );
  }
} 