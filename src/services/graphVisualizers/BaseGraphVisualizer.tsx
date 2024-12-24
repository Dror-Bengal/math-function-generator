import { Layout as PlotlyLayout } from 'plotly.js';
import { Point, FunctionCharacteristics, CircleData } from '../../types/FunctionTypes';

export interface GraphConfig {
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

export abstract class BaseGraphVisualizer {
  protected static readonly DEFAULT_CONFIG: GraphConfig = {
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

  protected static generatePoints(
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

  protected static createBaseLayout(config: GraphConfig): Partial<PlotlyLayout> {
    return {
      width: config.width,
      height: config.height,
      autosize: true,
      margin: { l: 60, r: 50, t: 50, b: 60 },
      title: 'גרף הפונקציה',
      xaxis: {
        range: config.xRange,
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
        range: config.yRange,
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
  }

  protected static createGraphContainer() {
    return {
      width: '100%',
      height: '500px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      overflow: 'hidden'
    };
  }

  abstract plot(
    func: ((x: number) => number | undefined) | CircleData,
    characteristics: FunctionCharacteristics,
    config?: Partial<GraphConfig>
  ): JSX.Element;
} 