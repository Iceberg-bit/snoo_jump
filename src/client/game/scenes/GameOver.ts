import { Scene } from 'phaser';
import * as Phaser from 'phaser';

interface GameOverData {
  score: number;
  highScore: number;
}

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameOverText: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  highScoreText: Phaser.GameObjects.Text;
  restartText: Phaser.GameObjects.Text;
  menuText: Phaser.GameObjects.Text;

  constructor() {
    super('GameOver');
  }

  create(data: GameOverData) {
    const { width, height } = this.scale;
    
    // Configure camera
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1a1a2e);

    // Background
    this.background = this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height)
      .setAlpha(0.1);

    // Game Over text
    this.gameOverText = this.add
      .text(width / 2, height * 0.25, 'GAME OVER', {
        fontFamily: 'Arial Black',
        fontSize: '48px',
        color: '#FF4500',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
        align: 'center',
      })
      .setOrigin(0.5);

    // Score display
    this.scoreText = this.add
      .text(width / 2, height * 0.4, `Final Score: ${data.score}`, {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center'
      })
      .setOrigin(0.5);

    // High score display
    const isNewHighScore = data.score === data.highScore && data.score > 0;
    this.highScoreText = this.add
      .text(width / 2, height * 0.5, 
        isNewHighScore ? `NEW HIGH SCORE: ${data.highScore}!` : `High Score: ${data.highScore}`, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: isNewHighScore ? '#FFD700' : '#CCCCCC',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center'
      })
      .setOrigin(0.5);

    if (isNewHighScore) {
      this.tweens.add({
        targets: this.highScoreText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }

    // Restart button
    this.restartText = this.add
      .text(width / 2, height * 0.7, 'PLAY AGAIN', {
        fontFamily: 'Arial Black',
        fontSize: '24px',
        color: '#00FF00',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.restartText.setScale(1.1))
      .on('pointerout', () => this.restartText.setScale(1))
      .on('pointerdown', () => this.scene.start('DoodleGame'));

    // Menu button
    this.menuText = this.add
      .text(width / 2, height * 0.8, 'MAIN MENU', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.menuText.setScale(1.1))
      .on('pointerout', () => this.menuText.setScale(1))
      .on('pointerdown', () => this.scene.start('StartScreen'));

    // Handle resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.updateLayout(gameSize.width, gameSize.height);
    });
  }

  private updateLayout(width: number, height: number): void {
    this.cameras.resize(width, height);

    if (this.background) {
      this.background.setPosition(width / 2, height / 2);
      this.background.setDisplaySize(width, height);
    }

    const scaleFactor = Math.min(Math.min(width / 1024, height / 768), 1);

    if (this.gameOverText) {
      this.gameOverText.setPosition(width / 2, height * 0.25);
      this.gameOverText.setScale(scaleFactor);
    }

    if (this.scoreText) {
      this.scoreText.setPosition(width / 2, height * 0.4);
      this.scoreText.setScale(scaleFactor);
    }

    if (this.highScoreText) {
      this.highScoreText.setPosition(width / 2, height * 0.5);
      this.highScoreText.setScale(scaleFactor);
    }

    if (this.restartText) {
      this.restartText.setPosition(width / 2, height * 0.7);
      this.restartText.setScale(scaleFactor);
    }

    if (this.menuText) {
      this.menuText.setPosition(width / 2, height * 0.8);
      this.menuText.setScale(scaleFactor);
    }
  }
}
