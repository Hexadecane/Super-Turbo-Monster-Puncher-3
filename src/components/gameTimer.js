class gameTimerClass {
  // Class for the game timer and its properties and methods.
  // enemyManager is passed in as the argument to keep track of the number of
  // enemies alive, which is used for the timer's win/lose state.
  constructor(enemyManager) {
    this.timeRemaining = 150;
    this.timerEvent;
    this.getTimeRemaining = () => {
      return this.timeRemaining.toString().padStart(3, '0');
    };
    this.resetTime = () => {
      this.timeRemaining = 150;
    };
    this.tickTimer = () => {
      if (enemyManager.currentEnemyCount > 0) {
        this.timeRemaining--;
      }
      else {
        this.timerEvent.paused = true;
        totalScore = player.score;
        completeLevel()
      }
      if (this.timeRemaining === 0) {
        if (enemyManager.currentEnemyCount > 0) {
          player.die();
          spawnEnemies = false;
          this.timerEvent.paused = true;
          totalScore = player.score;
          setTimeout(() => {
            parentThis.scene.launch('gameOverScene');
            parentThis.scene.stop('mainScene');
          }, 1500);
        }
        else {
          this.resetTime();
        }
      }
      updateText('timeRemaining', this.getTimeRemaining);
    };
    this.startTimer = () => {
      let gameTimerEventArgs = {
        delay: 1000, callback: this.tickTimer, repeat: -1
      };
      this.timerEvent = parentThis.time.addEvent(gameTimerEventArgs);
    };
  }
}