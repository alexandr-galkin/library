export class GameStats {
  constructor() {
    this.totalScore = 0;
    this.resetLevel();
  }

  resetLevel() {
    this.levelScore = 0;
    this.placed = 0;
    this.mistakes = 0;
    this.combo = 0;
  }

  addCorrect(points) {
    const value = Math.max(0, Number(points) || 0);
    this.combo += 1;
    this.placed += 1;
    this.levelScore += value;
    this.totalScore += value;
  }

  addMistake() {
    this.combo = 0;
    this.mistakes += 1;
  }

  addBonus(points) {
    const value = Math.max(0, Number(points) || 0);
    this.levelScore += value;
    this.totalScore += value;
  }

  accuracy(totalObjects) {
    const total = Math.max(0, Number(totalObjects) || 0);
    if (total === 0) return 1;
    return Math.min(1, Math.max(0, (total - this.mistakes) / total));
  }

  stars() {
    if (this.mistakes === 0) return 3;
    if (this.mistakes <= 2) return 2;
    return 1;
  }
}
