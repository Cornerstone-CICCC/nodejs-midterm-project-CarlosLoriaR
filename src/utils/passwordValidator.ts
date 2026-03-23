import zxcvbn from 'zxcvbn';

export interface PasswordStrength {
  isStrong: boolean;
  score: number;
  feedback: string;
}

export function validatePassword(password: string): PasswordStrength {
  const result = zxcvbn(password);

  let feedback = '';
  if (result.feedback.warning) {
    feedback = result.feedback.warning;
  }
  if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
    feedback += (feedback ? ' ' : '') + result.feedback.suggestions[0];
  }

  return {
    isStrong: result.score >= 2,
    score: result.score,
    feedback: feedback || 'Password is acceptable',
  };
}
