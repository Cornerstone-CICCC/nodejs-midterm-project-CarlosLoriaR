declare module 'zxcvbn' {
  interface Feedback {
    warning?: string;
    suggestions?: string[];
  }

  interface ZxcvbnResult {
    score: number;
    feedback: Feedback;
  }

  function zxcvbn(password: string, userInputs?: string[]): ZxcvbnResult;
  export default zxcvbn;
}

