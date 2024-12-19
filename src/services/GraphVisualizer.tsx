import { Point, FunctionCharacteristics } from '../types/FunctionTypes';

interface GraphConfig {
  width: number;
  height: number;
  padding: number;
  xRange: [number, number];
  yRange: [number, number];
}

export class GraphVisualizer {
  private static readonly DEFAULT_CONFIG: GraphConfig = {
    width: 400,
    height: 400,
    padding: 40,
    xRange: [-10, 10],
    yRange: [-10, 10]
  };

  static createGraph(
    func: (x: number) => number | undefined,
    characteristics: FunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ) {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    return (
      <svg 
        className="w-full h-full"
        viewBox={`0 0 ${fullConfig.width} ${fullConfig.height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Add clipping path */}
        <defs>
          <clipPath id="graphClip">
            <rect
              x={fullConfig.padding}
              y={fullConfig.padding}
              width={fullConfig.width - 2 * fullConfig.padding}
              height={fullConfig.height - 2 * fullConfig.padding}
            />
          </clipPath>
        </defs>

        {/* Grid and Axes */}
        {this.renderGrid(fullConfig)}
        {this.renderAxes(fullConfig)}
        
        {/* Function Plot with clipping */}
        <g clipPath="url(#graphClip)">
          {this.renderFunction(func, fullConfig)}
        </g>
        
        {/* Special Points */}
        {characteristics.roots && this.renderRoots(characteristics.roots, fullConfig)}
        {characteristics.criticalPoints && this.renderCriticalPoints(characteristics.criticalPoints, fullConfig)}
        {typeof characteristics.yIntercept === 'number' && this.renderYIntercept(characteristics.yIntercept, fullConfig)}
        {characteristics.inflectionPoints && 
          this.renderInflectionPoints(characteristics.inflectionPoints, fullConfig)}
        
        {/* Labels */}
        {this.renderLabels(characteristics, fullConfig)}
      </svg>
    );
  }

  static createCircleGraph(
    circleData: CircleData,
    config: Partial<GraphConfig> = {}
  ) {
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
        {this.renderCircle(circleData, fullConfig)}
        
        {/* Special Points */}
        {this.renderCirclePoints(circleData, fullConfig)}
        
        {/* Intersection Points */}
        {circleData.intersectionPoints && 
          this.renderIntersectionPoints(circleData.intersectionPoints, fullConfig)}
        
        {/* Tangent Lines */}
        {circleData.characteristics?.tangentLines && 
          this.renderTangentLines(circleData.characteristics.tangentLines, fullConfig)}
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

  private static renderFunction(
    func: (x: number) => number | undefined,
    config: GraphConfig
  ): JSX.Element {
    const points: string[] = [];
    const step = (config.xRange[1] - config.xRange[0]) / 200;
    
    let lastY: number | undefined;
    
    for (let x = config.xRange[0]; x <= config.xRange[1]; x += step) {
      const y = func(x);
      
      // Skip undefined points or points outside the range
      if (y === undefined || isNaN(y) || Math.abs(y) > 1000) {
        lastY = undefined;
        continue;
      }
      
      const px = this.mapX(x, config);
      const py = this.mapY(y, config);
      
      // Start a new path segment if there was a break
      if (lastY === undefined) {
        points.push(`M ${px} ${py}`);
      } else {
        points.push(`L ${px} ${py}`);
      }
      
      lastY = y;
    }
    
    return <path d={points.join(' ')} stroke="#4F46E5" strokeWidth="2" fill="none" />;
  }

  private static renderSpecialPoint(
    point: Point,
    config: GraphConfig,
    className: string
  ) {
    return (
      <g className={`special-point ${className}`}>
        <circle
          cx={this.mapX(point.x, config)}
          cy={this.mapY(point.y, config)}
          r="4"
          className="point-marker"
        />
        <text
          x={this.mapX(point.x, config)}
          y={this.mapY(point.y, config) - 10}
          className="point-label"
          textAnchor="middle"
        >
          ({point.x.toFixed(1)}, {point.y.toFixed(1)})
        </text>
      </g>
    );
  }

  private static renderRoots(roots: Point[], config: GraphConfig) {
    return (
      <g className="roots">
        {roots.map((root, index) => (
          <g key={`root-${index}-${root.x}-${root.y}`} className="special-point">
            <circle
              cx={this.mapX(root.x, config)}
              cy={this.mapY(root.y, config)}
              r="3"
              fill="white"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <text
              x={this.mapX(root.x, config)}
              y={this.mapY(root.y, config) - 10}
              textAnchor="middle"
              className="point-label"
            >
              ({root.x.toFixed(1)}, {root.y.toFixed(1)})
            </text>
          </g>
        ))}
      </g>
    );
  }

  private static renderCriticalPoints(points: Point[], config: GraphConfig) {
    return (
      <g className="critical-points">
        {points.map((point, index) => (
          <g key={`critical-${index}-${point.x}-${point.y}`} className="special-point">
            <circle
              cx={this.mapX(point.x, config)}
              cy={this.mapY(point.y, config)}
              r="3"
              fill="white"
              stroke="#8b5cf6"
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

  private static renderInflectionPoints(points: Point[], config: GraphConfig) {
    return (
      <g className="inflection-points">
        {points.map((point, index) => (
          <g key={`inflection-${index}-${point.x}-${point.y}`} className="special-point">
            <circle
              cx={this.mapX(point.x, config)}
              cy={this.mapY(point.y, config)}
              r="3"
              fill="white"
              stroke="#10b981"
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

  private static renderYIntercept(yIntercept: number, config: GraphConfig) {
    const point: Point = { x: 0, y: yIntercept };
    return this.renderSpecialPoint(point, config, 'y-intercept');
  }

  private static renderLabels(characteristics: FunctionCharacteristics, config: GraphConfig) {
    return (
      <g className="function-labels">
        {/* Add any additional labels you want to show */}
      </g>
    );
  }

  private static renderCircle(circleData: CircleData, config: GraphConfig) {
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
    tangentLines: { point: Point; slope: number }[],
    config: GraphConfig
  ) {
    return (
      <g className="tangent-lines">
        {tangentLines.map((line, index) => {
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
} 