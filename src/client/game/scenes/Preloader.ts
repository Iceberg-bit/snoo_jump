import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets');

    // Load logo
    this.load.image('logo', 'logo.png');
    
    // Create graphics for game elements
    this.createGameAssets();
  }

  createGameAssets() {
    // Create Snoo (player) - orange circle with antenna
    const snooGraphics = this.add.graphics();
    snooGraphics.fillStyle(0xFF4500); // Reddit orange
    snooGraphics.fillCircle(25, 25, 20);
    snooGraphics.fillStyle(0xFFFFFF);
    snooGraphics.fillCircle(20, 20, 3); // left eye
    snooGraphics.fillCircle(30, 20, 3); // right eye
    snooGraphics.lineStyle(3, 0xFF4500);
    snooGraphics.lineBetween(25, 5, 20, 0); // left antenna
    snooGraphics.lineBetween(25, 5, 30, 0); // right antenna
    snooGraphics.fillStyle(0xFF4500);
    snooGraphics.fillCircle(20, 0, 2); // left antenna tip
    snooGraphics.fillCircle(30, 0, 2); // right antenna tip
    snooGraphics.generateTexture('snoo', 50, 50);
    snooGraphics.destroy();

    // Create golden Snoo for power-up state
    const goldenSnooGraphics = this.add.graphics();
    goldenSnooGraphics.fillStyle(0xFFD700); // Gold
    goldenSnooGraphics.fillCircle(25, 25, 20);
    goldenSnooGraphics.fillStyle(0x000000);
    goldenSnooGraphics.fillCircle(20, 20, 3); // left eye
    goldenSnooGraphics.fillCircle(30, 20, 3); // right eye
    goldenSnooGraphics.lineStyle(3, 0xFFD700);
    goldenSnooGraphics.lineBetween(25, 5, 20, 0); // left antenna
    goldenSnooGraphics.lineBetween(25, 5, 30, 0); // right antenna
    goldenSnooGraphics.fillStyle(0xFFD700);
    goldenSnooGraphics.fillCircle(20, 0, 2); // left antenna tip
    goldenSnooGraphics.fillCircle(30, 0, 2); // right antenna tip
    goldenSnooGraphics.generateTexture('snoo-golden', 50, 50);
    goldenSnooGraphics.destroy();

    // Create platform
    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x00FF00); // Green
    platformGraphics.fillRoundedRect(0, 0, 80, 15, 7);
    platformGraphics.generateTexture('platform', 80, 15);
    platformGraphics.destroy();

    // Create moving platform
    const movingPlatformGraphics = this.add.graphics();
    movingPlatformGraphics.fillStyle(0x0080FF); // Blue
    movingPlatformGraphics.fillRoundedRect(0, 0, 80, 15, 7);
    movingPlatformGraphics.generateTexture('platform-moving', 80, 15);
    movingPlatformGraphics.destroy();

    // Create broken platform
    const brokenPlatformGraphics = this.add.graphics();
    brokenPlatformGraphics.fillStyle(0xFF8000); // Orange
    brokenPlatformGraphics.fillRoundedRect(0, 0, 80, 15, 7);
    brokenPlatformGraphics.generateTexture('platform-broken', 80, 15);
    brokenPlatformGraphics.destroy();

    // Create power-up
    const powerUpGraphics = this.add.graphics();
    powerUpGraphics.fillStyle(0xFFD700); // Gold
    powerUpGraphics.fillStar(20, 20, 5, 15, 8);
    powerUpGraphics.generateTexture('powerup', 40, 40);
    powerUpGraphics.destroy();

    // Create UFO enemy
    const ufoGraphics = this.add.graphics();
    ufoGraphics.fillStyle(0x8000FF); // Purple
    ufoGraphics.fillEllipse(30, 20, 60, 20);
    ufoGraphics.fillStyle(0xFF0080); // Pink
    ufoGraphics.fillEllipse(30, 15, 40, 15);
    ufoGraphics.generateTexture('ufo', 60, 40);
    ufoGraphics.destroy();

    // Create alien enemy
    const alienGraphics = this.add.graphics();
    alienGraphics.fillStyle(0x00FF80); // Green
    alienGraphics.fillEllipse(20, 25, 30, 20);
    alienGraphics.fillStyle(0xFF0000); // Red eyes
    alienGraphics.fillCircle(15, 20, 3);
    alienGraphics.fillCircle(25, 20, 3);
    alienGraphics.generateTexture('alien', 40, 50);
    alienGraphics.destroy();
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the StartScreen instead of MainMenu
    this.scene.start('StartScreen');
  }
}