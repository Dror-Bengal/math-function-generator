import { linearTemplates } from './linearTemplates';
import { quadraticTemplates } from './quadraticTemplates';
import { polynomialTemplates } from './polynomialTemplates';
import { rationalTemplates } from './rationalTemplates';
import { trigonometricTemplates } from './trigonometricTemplates';
import { circleTemplates } from './circleTemplates';

export { linearTemplates } from './linearTemplates';
export { quadraticTemplates } from './quadraticTemplates';
export { polynomialTemplates } from './polynomialTemplates';
export { rationalTemplates } from './rationalTemplates';
export { trigonometricTemplates } from './trigonometricTemplates';
export { circleTemplates } from './circleTemplates';

export type TemplateType = 'linear' | 'quadratic' | 'polynomial' | 'rational' | 'trigonometric' | 'circle';

export const allTemplates = {
  linear: linearTemplates,
  quadratic: quadraticTemplates,
  polynomial: polynomialTemplates,
  rational: rationalTemplates,
  trigonometric: trigonometricTemplates,
  circle: circleTemplates
}; 