export class GameStats {
  constructor() {
    this.resetLevel();
    this.totalScore = 0;
  }

  resetLevel() {
    this.levelScore = 0;
    this.placed = 0;
    this.mistakes = 0;
    this.combo = 0;
  }

  addCorrect(points) {
    this.combo += 1;
    this.placed += 1;
    this.levelScore += points;
    this.totalScore += points;
  }

  addMistake() {
    this.combo = 0;
    this.mistakes += 1;
  }

  addBonus(points) {
    this.levelScore += points;
    this.totalScore += points;
  }

  accuracy(totalObjects) {
    if (!totalObjects) return 1;
    return Math.max(0, (totalObjects - this.mistakes) / totalObjects);
  }

  stars() {
    if (this.mistakes === 0) return 3;
    if (this.mistakes <= 2) return 2;
    return 1;
  }
}
