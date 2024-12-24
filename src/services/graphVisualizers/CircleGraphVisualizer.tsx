import React from 'react';
import Plot from 'react-plotly.js';
import { PlotData } from 'plotly.js';
import { FunctionType, Point, FunctionCharacteristics, CircleData } from '../../types/FunctionTypes';
import { BaseGraphVisualizer, GraphConfig } from './BaseGraphVisualizer';
import DebugLogger from '../../utils/debugLogger';

const IS_DEBUG = process.env.NODE_ENV === 'development';

export class CircleGraphVisualizer extends BaseGraphVisualizer {
  plot(
    func: ((x: number) => number | undefined) | CircleData,
    characteristics: FunctionCharacteristics,
    config: Partial<GraphConfig> = {}
  ): JSX.Element {
    // Handle case where center and radius are in characteristics
    const circleData = func as CircleData;
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

    const mergedConfig: GraphConfig = {
      ...BaseGraphVisualizer.DEFAULT_CONFIG,
      width: 800,
      height: 500,
      ...config
    };

    // Debug logging
    if (IS_DEBUG) {
      DebugLogger.logFunction({
        type: FunctionType.CIRCLE,
        expression: processedCircleData.equation || '',
        characteristics: processedCircleData.characteristics || {},
        points: []
      });
      DebugLogger.logGraph({
        ...mergedConfig,
        functionType: FunctionType.CIRCLE,
        calculatedYRange: [
          processedCircleData.center.y - processedCircleData.radius * 1.2,
          processedCircleData.center.y + processedCircleData.radius * 1.2
        ]
      });
    }

    const layout = BaseGraphVisualizer.createBaseLayout({
      ...mergedConfig,
      xRange: [
        processedCircleData.center.x - processedCircleData.radius * 1.2,
        processedCircleData.center.x + processedCircleData.radius * 1.2
      ],
      yRange: [
        processedCircleData.center.y - processedCircleData.radius * 1.2,
        processedCircleData.center.y + processedCircleData.radius * 1.2
      ]
    });

    // Generate circle points
    const { x, y } = CircleGraphVisualizer.generateCirclePoints(processedCircleData);

    return (
      <div style={BaseGraphVisualizer.createGraphContainer()}>
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines',
            x,
            y,
            line: { color: '#4F46E5', width: 2 }
          }]}
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