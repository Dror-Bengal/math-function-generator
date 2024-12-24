import { FunctionData } from '../types/FunctionTypes';

class DebugLogger {
  private static enabled = true;
  private static readonly SEPARATOR = '━'.repeat(50);
  private static lastLogTime: { [key: string]: number } = {};
  private static DEBOUNCE_TIME = 1000; // Increased to 1 second for better readability

  private static formatSection(title: string): string {
    return `\n${this.SEPARATOR}\n📌 ${title}\n${this.SEPARATOR}`;
  }

  private static formatSubSection(title: string): string {
    return `\n▸ ${title}:`;
  }

  private static formatValue(value: any): string {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  private static shouldLog(section: string): boolean {
    const now = Date.now();
    if (!this.lastLogTime[section] || now - this.lastLogTime[section] > this.DEBOUNCE_TIME) {
      this.lastLogTime[section] = now;
      return true;
    }
    return false;
  }

  private static clearPreviousLogs() {
    if (typeof console.clear === 'function') {
      console.clear();
    }
  }

  static log(message: string, data?: any) {
    if (!this.enabled) return;
    console.log(`[Debug] ${message}`, data ? data : '');
  }

  static logFunction(func: FunctionData) {
    if (!this.enabled || !this.shouldLog('function')) return;
    this.clearPreviousLogs();
    console.log(this.formatSection('Function Generated'));
    console.log(this.formatSubSection('Type'), func.type);
    console.log(this.formatSubSection('Expression'), func.expression);
    console.log(this.formatSubSection('Characteristics'), this.formatValue({
      domain: func.characteristics?.domain,
      range: func.characteristics?.range,
      roots: func.characteristics?.roots?.map(r => `(${r.x.toFixed(2)}, ${r.y.toFixed(2)})`),
      criticalPoints: func.characteristics?.criticalPoints?.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`),
      signIntervals: func.characteristics?.signIntervals ? {
        positive: func.characteristics.signIntervals.positive,
        negative: func.characteristics.signIntervals.negative,
        zero: func.characteristics.signIntervals.zero?.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`)
      } : undefined
    }));
  }

  static logPoints(points: any[]) {
    if (!this.enabled || !this.shouldLog('points')) return;
    console.log(this.formatSection('Points Generated'));
    
    console.log(this.formatSubSection('Total Points'), points.length);
    console.log(this.formatSubSection('X Range'), this.formatValue({
      min: Math.min(...points.map(p => p.x)).toFixed(2),
      max: Math.max(...points.map(p => p.x)).toFixed(2)
    }));
    console.log(this.formatSubSection('Y Range'), this.formatValue({
      min: Math.min(...points.map(p => p.y)).toFixed(2),
      max: Math.max(...points.map(p => p.y)).toFixed(2)
    }));
  }

  static logGraph(config: any) {
    if (!this.enabled || !this.shouldLog('graph')) return;
    console.log(this.formatSection('Graph Configuration'));
    
    console.log(this.formatSubSection('Container'), this.formatValue({
      width: config.width,
      height: config.height,
      padding: config.padding
    }));

    console.log(this.formatSubSection('Ranges'), this.formatValue({
      x: `[${config.xRange[0]}, ${config.xRange[1]}]`,
      y: `[${config.yRange[0].toFixed(2)}, ${config.yRange[1].toFixed(2)}]`,
      calculatedY: config.calculatedYRange ? 
        `[${config.calculatedYRange[0].toFixed(2)}, ${config.calculatedYRange[1].toFixed(2)}]` : 
        'Not calculated'
    }));

    console.log(this.formatSubSection('Function Type'), config.functionType);
    console.log(this.formatSubSection('Grid'), this.formatValue({
      step: config.gridStep,
      show: config.grid?.show,
      color: config.grid?.color
    }));
  }

  static logLayout(layout: any) {
    if (!this.enabled || !this.shouldLog('layout')) return;
    console.log(this.formatSection('Plot Layout'));
    
    console.log(this.formatSubSection('Size'), this.formatValue({
      width: layout.width,
      height: layout.height,
      autosize: layout.autosize
    }));

    console.log(this.formatSubSection('Margins'), this.formatValue(layout.margin));
    console.log(this.formatSubSection('Axes'), this.formatValue({
      xaxis: {
        range: layout.xaxis?.range,
        title: layout.xaxis?.title
      },
      yaxis: {
        range: layout.yaxis?.range,
        title: layout.yaxis?.title
      }
    }));
  }

  static enable() {
    this.enabled = true;
    this.lastLogTime = {}; // Reset log times when enabling
  }

  static disable() {
    this.enabled = false;
    this.lastLogTime = {}; // Clear log times when disabling
  }
}

export default DebugLogger; 