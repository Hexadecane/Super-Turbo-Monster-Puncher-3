class gameTimer {
  // Class for the game timer and its properties and methods.
  // enemyManager is passed in as the argument to keep track of the number of
  // enemies alive, which is used for the timer's win/lose state.
  constructor(enemyManager) {
    this.timeRemaining = 90;
    this.getTimeRemaining = () => {
      return this.timeRemaining.toString().padStart(3, '0');
    };
    this.resetTime = () => {
      this.timeRemaining = 90;
    };
    this.tickTimer = () => {
      this.timeRemaining--;
      if (this.timeRemaining === -1) {
        /*if (enemyManager.enemyCount > 0) {
          player.die();
          for (let z of zombies) {
            z.die();
          }
          zombiesAlive = 0;
        }*/
        this.resetTime();
      }
      updateText('timeRemaining', this.getTimeRemaining);
    };
    this.startTimer = () => {
      let gameTimerEventArgs = {
        delay: 1000, callback: this.tickTimer, repeat: -1
      };
      parentThis.time.addEvent(gameTimerEventArgs);
    };
  }
}