export enum Expectation {
  BELOW = 'BELOW',
  MEETS = 'MEETS',
  EXCEEDS = 'EXCEEDS',
}

export const getExpectation = (
  score: number,
  benchmark: number,
): Expectation => {
  const a = benchmark * 0.5;
  const b = benchmark * 1.5;
  if (score < a) return Expectation.BELOW;
  if (score <= b) return Expectation.MEETS;
  return Expectation.EXCEEDS;
}

export const getExpectationColor = (e: Expectation): string => {
  switch (e) {
    case Expectation.BELOW:
      return colors.below;
    case Expectation.MEETS:
      return colors.meets;
    case Expectation.EXCEEDS:
      return colors.exceeds;
  }
}

import { colors } from './colors';