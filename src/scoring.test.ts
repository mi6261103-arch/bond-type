import { describe, expect, it } from "vitest";

import { questions, resultProfiles } from "./data";
import { calculateResult } from "./scoring";

describe("calculateResult", () => {
  it("returns different results for distinct answer patterns", () => {
    const allSocial = Array.from({ length: 10 }, (_, questionIndex) => ({
      questionIndex,
      answerIndex: 0,
    }));
    const allReflective = Array.from({ length: 10 }, (_, questionIndex) => ({
      questionIndex,
      answerIndex: 2,
    }));

    expect(calculateResult(allSocial)).not.toBe(calculateResult(allReflective));
  });

  it("uses a stable result when there are no answers", () => {
    expect(calculateResult([])).toBe("steady");
    expect(calculateResult(Array(10).fill(null))).toBe("steady");
  });

  it("uses primary-answer votes to break score ties", () => {
    const tie = [
      { questionIndex: 0, answerIndex: 0 },
      { questionIndex: 0, answerIndex: 1 },
    ];
    expect(calculateResult(tie)).toBe("spark");
  });

  it("uses a fixed profile order when score and vote counts tie", () => {
    const tie = [
      { questionIndex: 0, answerIndex: 0 },
      { questionIndex: 0, answerIndex: 1 },
      { questionIndex: 0, answerIndex: 2 },
      { questionIndex: 0, answerIndex: 3 },
    ];
    expect(calculateResult(tie)).toBe("spark");
  });

  it("can return every result type from an answer pattern", () => {
    for (const profile of resultProfiles) {
      const selections = questions.flatMap((question, questionIndex) => {
        const answerIndex = question.answers.findIndex(
          (answer) => answer.primary === profile.id,
        );
        return answerIndex === -1 ? [] : [{ questionIndex, answerIndex }];
      });
      expect(calculateResult(selections)).toBe(profile.id);
    }
  });
});
