export const handler = async (event: any) => {
  const expectedAnswer = event.request.privateChallengeParameters.code;
  const userAnswer = event.request.challengeAnswer;

  event.response.answerCorrect = expectedAnswer === userAnswer;

  return event;
};
