/**
 * Frontend API Service
 */

import { AnalyzeChartRequest } from '../../types/api';
import { AnalysisResult } from '../../types/analysis';

export const apiService = {
  analyzeChart: async (data: AnalyzeChartRequest): Promise<AnalysisResult> => {
    const response = await fetch('/api/analyze-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to analyze chart');
    }

    return result;
  },

  checkHealth: async () => {
    const response = await fetch('/api/health');
    return response.json();
  }
};
