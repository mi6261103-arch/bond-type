import { questions, resultProfiles, type ResultId } from "./data";

export type AnswerSelection = {
  questionIndex: number;
  answerIndex: number;
};

export function calculateResult(
  selections: Array<AnswerSelection | null>,
): ResultId {
  const scores = new Map<ResultId, number>(
    resultProfiles.map(({ id }) => [id, 0]),
  );
  const primaryVotes = new Map<ResultId, number>(
    resultProfiles.map(({ id }) => [id, 0]),
  );

  selections.forEach((selection) => {
    if (!selection) return;
    const answer = questions[selection.questionIndex]?.answers[selection.answerIndex];
    if (!answer) return;

    scores.set(answer.primary, (scores.get(answer.primary) ?? 0) + 2);
    scores.set(answer.secondary, (scores.get(answer.secondary) ?? 0) + 1);
    primaryVotes.set(
      answer.primary,
      (primaryVotes.get(answer.primary) ?? 0) + 1,
    );
  });

  return resultProfiles.reduce((winner, candidate) => {
    const candidateScore = scores.get(candidate.id) ?? 0;
    const winnerScore = scores.get(winner.id) ?? 0;
    if (candidateScore > winnerScore) return candidate;
    if (candidateScore < winnerScore) return winner;

    const candidateVotes = primaryVotes.get(candidate.id) ?? 0;
    const winnerVotes = primaryVotes.get(winner.id) ?? 0;
    if (candidateVotes > winnerVotes) return candidate;
    if (candidateVotes < winnerVotes) return winner;

    return resultProfiles.indexOf(candidate) < resultProfiles.indexOf(winner)
      ? candidate
      : winner;
  }, resultProfiles[0]).id;
}
