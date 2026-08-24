const BASE_POINTS = 100;
const MAX_COMBO_MULTIPLIER = 10;
const TIME_BONUS_PER_SECOND = 10;
const MAX_ACCURACY_BONUS = 500;

const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;

export class ScoreCalculator {
  static pointsForCombo(combo) {
    const normalized = Math.max(1, Math.floor(finite(combo)));
    return BASE_POINTS * Math.min(normalized, MAX_COMBO_MULTIPLIER);
  }

  static timeBonus(remainingSeconds, hasTimer) {
    if (!hasTimer) return 0;
    return Math.max(0, Math.floor(finite(remainingSeconds))) * TIME_BONUS_PER_SECOND;
  }

  static accuracyBonus(accuracy) {
    const normalized = Math.min(1, Math.max(0, finite(accuracy)));
    return Math.floor(normalized * MAX_ACCURACY_BONUS);
  }
}
