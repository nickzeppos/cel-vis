export enum Expectation {
  BELOW = "BELOW",
  MEETS = "MEETS",
  EXCEEDS = "EXCEEDS",
}

export const expectationsColors = {
  below: "#dc2626", // red-600
  meets: "#2563eb", // blue-600
  exceeds: "#16a34a", // green-600
  accent: "hsl(15 84% 53%)",
} as const;

export const getExpectation = (
  score: number,
  benchmark: number
): Expectation => {
  const a = benchmark * 0.5;
  const b = benchmark * 1.5;
  if (score < a) return Expectation.BELOW;
  if (score <= b) return Expectation.MEETS;
  return Expectation.EXCEEDS;
};

export const getExpectationColor = (e: Expectation): string => {
  switch (e) {
    case Expectation.BELOW:
      return expectationsColors.below;
    case Expectation.MEETS:
      return expectationsColors.meets;
    case Expectation.EXCEEDS:
      return expectationsColors.exceeds;
  }
};
