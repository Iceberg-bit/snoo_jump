import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class StartScreen extends Scene {
  private background: Phaser.GameObjects.Image;
  private titleText: Phaser.GameObjects.Text;
  private instructionsText: Phaser.GameObjects.Text;
  private startText: Phaser.GameObjects.Text;

  constructor() {
    super('StartScreen');
  }

  create() {
    const { width, height } = this.scale;
    
    // Dark background
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    
    // Background image with dark overlay
    this.background = this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height)
      .setAlpha(0.1);

    // Title
    this.titleText = this.add.text(width / 2, height * 0.15, 'SNOO JUMP', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#FF4500',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Instructions
    const instructions = [
      'HOW TO PLAY:',
      '',
      '• Tilt left/right or use arrow keys to move',
      '• Jump on platforms to go higher',
      '• Avoid UFOs and aliens - they\'re deadly!',
      '• Collect golden stars for invincibility',
      '• Green platforms are safe',
      '• Blue platforms move side to side',
      '• Orange platforms break after landing',
      '',
      'Get the highest score possible!'
    ];

    this.instructionsText = this.add.text(width / 2, height * 0.45, instructions.join('\n'), {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#FFFFFF',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    // Start prompt
    this.startText = this.add.text(width / 2, height * 0.85, 'TAP TO START', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#00FF00',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center'
    }).setOrigin(0.5);

    // Blinking animation for start text
    this.tweens.add({
      targets: this.startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Start game on click/tap
    this.input.once('pointerdown', () => {
      this.scene.start('DoodleGame');
    });

    // Handle resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.updateLayout(gameSize.width, gameSize.height);
    });
  }

  private updateLayout(width: number, height: number) {
    this.cameras.resize(width, height);
    
    if (this.background) {
      this.background.setPosition(width / 2, height / 2);
      this.background.setDisplaySize(width, height);
    }

    const scaleFactor = Math.min(width / 1024, height / 768);

    if (this.titleText) {
      this.titleText.setPosition(width / 2, height * 0.15);
      this.titleText.setScale(scaleFactor);
    }

    if (this.instructionsText) {
      this.instructionsText.setPosition(width / 2, height * 0.45);
      this.instructionsText.setScale(scaleFactor);
    }

    if (this.startText) {
      this.startText.setPosition(width / 2, height * 0.85);
      this.startText.setScale(scaleFactor);
    }
  }
}