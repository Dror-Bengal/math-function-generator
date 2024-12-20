import { FunctionData } from '../types/FunctionTypes';

class DebugLogger {
  private static enabled = true;

  static log(message: string, data?: any) {
    if (!this.enabled) return;
    console.log(`[Debug] ${message}`, data ? data : '');
  }

  static logFunction(func: FunctionData) {
    if (!this.enabled) return;
    console.log('🔵 Function Generated:', {
      type: func.type,
      expression: func.expression,
      characteristics: {
        domain: func.characteristics?.domain,
        range: func.characteristics?.range,
        roots: func.characteristics?.roots?.map(r => `(${r.x}, ${r.y})`),
        criticalPoints: func.characteristics?.criticalPoints?.map(p => `(${p.x}, ${p.y})`),
        inflectionPoints: func.characteristics?.inflectionPoints?.map(p => `(${p.x}, ${p.y})`)
      }
    });
  }

  static logGraph(config: any) {
    if (!this.enabled) return;
    console.group('📊 Graph Configuration:');
    console.log('Container:', {
      width: config.width,
      height: config.height,
      padding: config.padding
    });
    console.log('Ranges:', {
      x: `[${config.xRange[0]}, ${config.xRange[1]}]`,
      y: `[${config.yRange[0].toFixed(2)}, ${config.yRange[1].toFixed(2)}]`,
      calculatedY: config.calculatedYRange ? 
        `[${config.calculatedYRange[0].toFixed(2)}, ${config.calculatedYRange[1].toFixed(2)}]` : 
        'Not calculated'
    });
    console.log('Function Type:', config.functionType);
    console.log('Grid:', {
      step: config.gridStep,
      show: config.grid?.show,
      color: config.grid?.color
    });
    console.groupEnd();
  }

  static logLayout(layout: any) {
    if (!this.enabled) return;
    console.group('📐 Plot Layout:');
    console.log('Size:', {
      width: layout.width,
      height: layout.height,
      autosize: layout.autosize
    });
    console.log('Margins:', layout.margin);
    console.log('Axes:', {
      xaxis: {
        range: layout.xaxis?.range,
        title: layout.xaxis?.title
      },
      yaxis: {
        range: layout.yaxis?.range,
        title: layout.yaxis?.title
      }
    });
    console.groupEnd();
  }

  static logPoints(points: any[]) {
    if (!this.enabled) return;
    console.group('📍 Points Generated:');
    console.log('Total Points:', points.length);
    console.log('X Range:', {
      min: Math.min(...points.map(p => p.x)).toFixed(2),
      max: Math.max(...points.map(p => p.x)).toFixed(2)
    });
    console.log('Y Range:', {
      min: Math.min(...points.map(p => p.y)).toFixed(2),
      max: Math.max(...points.map(p => p.y)).toFixed(2)
    });
    console.groupEnd();
  }

  static enable() {
    this.enabled = true;
  }

  static disable() {
    this.enabled = false;
  }
}

export default DebugLogger; 