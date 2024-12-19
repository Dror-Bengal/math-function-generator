import { StudentProgress } from '../types/FunctionTypes';

export class AdaptiveLearningSystem {
  private static readonly PROMOTION_THRESHOLD = 3;
  private static readonly DEMOTION_THRESHOLD = 2;

  static evaluateAnswer(
    progress: StudentProgress,
    correctAnswers: { [key: string]: boolean }
  ): StudentProgress {
    const totalSteps = Object.keys(correctAnswers).length;
    const correctSteps = Object.values(correctAnswers).filter(v => v).length;
    const successRate = correctSteps / totalSteps;

    return {
      ...progress,
      successCount: successRate >= 0.8 ? progress.successCount + 1 : 0,
      failCount: successRate < 0.8 ? progress.failCount + 1 : 0,
      currentLevel: progress.currentLevel,
      weakAreas: Object.entries(correctAnswers)
        .filter(([_, isCorrect]) => !isCorrect)
        .map(([area]) => area),
      lastQuestionType: progress.lastQuestionType
    };
  }
} 