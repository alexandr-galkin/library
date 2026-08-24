const BASE_POINTS = 100;
const MAX_COMBO_MULTIPLIER = 10;
const TIME_BONUS_PER_SECOND = 10;
const MAX_ACCURACY_BONUS = 500;

export class ScoreCalculator {
  static pointsForCombo(combo) {
    return BASE_POINTS * Math.min(Math.max(combo, 1), MAX_COMBO_MULTIPLIER);
  }

  static timeBonus(remainingSeconds, hasTimer) {
    if (!hasTimer || remainingSeconds <= 0) return 0;
    return Math.floor(remainingSeconds) * TIME_BONUS_PER_SECOND;
  }

  static accuracyBonus(accuracy) {
    return Math.floor(Math.max(0, Math.min(1, accuracy)) * MAX_ACCURACY_BONUS);
  }
}
