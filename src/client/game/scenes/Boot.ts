import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image('background', 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg');
  }

  create() {
    this.scene.start('Preloader');
  }
}
