import { Scene } from 'phaser';
import * as Phaser from 'phaser';

interface Platform {
  sprite: Phaser.GameObjects.Image;
  type: 'normal' | 'moving' | 'broken';
  broken?: boolean;
  direction?: number;
}

interface Enemy {
  sprite: Phaser.GameObjects.Image;
  type: 'ufo' | 'alien';
  direction?: number;
}

interface PowerUp {
  sprite: Phaser.GameObjects.Image;
  type: 'invincibility';
  duration: number;
}

export class DoodleGame extends Scene {
  private player: Phaser.GameObjects.Image;
  private platforms: Platform[] = [];
  private enemies: Enemy[] = [];
  private powerUps: PowerUp[] = [];
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private score: number = 0;
  private highScore: number = 0;
  private scoreText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;
  private cameraY: number = 0;
  private playerVelocityY: number = 0;
  private playerVelocityX: number = 0;
  private gravity: number = 0.5;
  private jumpPower: number = -15;
  private isInvincible: boolean = false;
  private invincibilityTimer: number = 0;
  private gameHeight: number = 0;

  constructor() {
    super('DoodleGame');
  }

  create() {
    const { width, height } = this.scale;
    this.gameHeight = height;
    
    // Dark space background
    this.cameras.main.setBackgroundColor(0x0f0f23);
    
    // Load high score
    this.highScore = parseInt(localStorage.getItem('snoo-jump-high-score') || '0');
    
    // Create player (Snoo)
    this.player = this.add.image(width / 2, height - 100, 'snoo');
    this.playerVelocityY = this.jumpPower;
    
    // Create initial platforms
    this.createInitialPlatforms();
    
    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // Create UI
    this.createUI();
    
    // Handle resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.updateLayout(gameSize.width, gameSize.height);
    });
  }

  private createUI() {
    const { width } = this.scale;
    
    this.scoreText = this.add.text(width - 20, 20, `Score: ${this.score}`, {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0).setScrollFactor(0);

    this.highScoreText = this.add.text(width - 20, 60, `High: ${this.highScore}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0).setScrollFactor(0);
  }

  private createInitialPlatforms() {
    const { width, height } = this.scale;
    
    // Create starting platform
    this.createPlatform(width / 2 - 40, height - 50, 'normal');
    
    // Create platforms going up
    for (let i = 1; i < 20; i++) {
      const x = Phaser.Math.Between(40, width - 120);
      const y = height - 50 - (i * 120);
      const type = this.getPlatformType();
      this.createPlatform(x, y, type);
      
      // Occasionally add enemies or power-ups
      if (i > 3 && Math.random() < 0.15) {
        if (Math.random() < 0.7) {
          this.createEnemy(x, y - 60);
        } else {
          this.createPowerUp(x, y - 60);
        }
      }
    }
  }

  private getPlatformType(): 'normal' | 'moving' | 'broken' {
    const rand = Math.random();
    if (rand < 0.7) return 'normal';
    if (rand < 0.9) return 'moving';
    return 'broken';
  }

  private createPlatform(x: number, y: number, type: 'normal' | 'moving' | 'broken') {
    let texture = 'platform';
    if (type === 'moving') texture = 'platform-moving';
    if (type === 'broken') texture = 'platform-broken';
    
    const sprite = this.add.image(x, y, texture);
    const platform: Platform = {
      sprite,
      type,
      direction: type === 'moving' ? (Math.random() < 0.5 ? -1 : 1) : undefined
    };
    
    this.platforms.push(platform);
  }

  private createEnemy(x: number, y: number) {
    const type = Math.random() < 0.6 ? 'ufo' : 'alien';
    const sprite = this.add.image(x, y, type);
    
    const enemy: Enemy = {
      sprite,
      type,
      direction: type === 'ufo' ? -1 : undefined
    };
    
    this.enemies.push(enemy);
  }

  private createPowerUp(x: number, y: number) {
    const sprite = this.add.image(x, y, 'powerup');
    const duration = [2000, 4000, 6000][Math.floor(Math.random() * 3)];
    
    const powerUp: PowerUp = {
      sprite,
      type: 'invincibility',
      duration
    };
    
    this.powerUps.push(powerUp);
    
    // Add floating animation
    this.tweens.add({
      targets: sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  update() {
    this.handleInput();
    this.updatePlayer();
    this.updatePlatforms();
    this.updateEnemies();
    this.updatePowerUps();
    this.updateCamera();
    this.checkCollisions();
    this.updateInvincibility();
    this.generateNewContent();
    this.cleanupOldObjects();
  }

  private handleInput() {
    const { width } = this.scale;
    
    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.playerVelocityX = Math.max(this.playerVelocityX - 0.5, -8);
    } else if (this.cursors.right.isDown) {
      this.playerVelocityX = Math.min(this.playerVelocityX + 0.5, 8);
    } else {
      this.playerVelocityX *= 0.9; // Friction
    }
    
    // Wrap around screen edges
    if (this.player.x < -25) {
      this.player.x = width + 25;
    } else if (this.player.x > width + 25) {
      this.player.x = -25;
    }
  }

  private updatePlayer() {
    // Apply gravity
    this.playerVelocityY += this.gravity;
    
    // Update position
    this.player.x += this.playerVelocityX;
    this.player.y += this.playerVelocityY;
    
    // Update player texture based on invincibility
    if (this.isInvincible) {
      this.player.setTexture('snoo-golden');
    } else {
      this.player.setTexture('snoo');
    }
  }

  private updatePlatforms() {
    this.platforms.forEach(platform => {
      if (platform.type === 'moving' && platform.direction) {
        platform.sprite.x += platform.direction * 2;
        
        // Bounce off screen edges
        if (platform.sprite.x <= 40 || platform.sprite.x >= this.scale.width - 40) {
          platform.direction *= -1;
        }
      }
    });
  }

  private updateEnemies() {
    this.enemies.forEach(enemy => {
      if (enemy.type === 'ufo' && enemy.direction) {
        enemy.sprite.x += enemy.direction * 3;
        
        // Remove UFOs that go off screen
        if (enemy.sprite.x < -50) {
          enemy.sprite.destroy();
          const index = this.enemies.indexOf(enemy);
          this.enemies.splice(index, 1);
        }
      }
    });
  }

  private updatePowerUps() {
    // Power-ups just float, no additional update needed
  }

  private updateCamera() {
    // Move camera up when player goes higher
    if (this.player.y < this.cameraY + 200) {
      const newCameraY = this.player.y - 200;
      this.cameras.main.scrollY = newCameraY;
      this.cameraY = newCameraY;
      
      // Update score based on height
      const newScore = Math.max(0, Math.floor(-this.cameraY / 10));
      if (newScore > this.score) {
        this.score = newScore;
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Update high score
        if (this.score > this.highScore) {
          this.highScore = this.score;
          this.highScoreText.setText(`High: ${this.highScore}`);
          localStorage.setItem('snoo-jump-high-score', this.highScore.toString());
        }
      }
    }
  }

  private checkCollisions() {
    // Platform collisions (only when falling)
    if (this.playerVelocityY > 0) {
      this.platforms.forEach(platform => {
        if (platform.broken) return;
        
        const bounds = platform.sprite.getBounds();
        const playerBounds = this.player.getBounds();
        
        if (Phaser.Geom.Rectangle.Overlaps(bounds, playerBounds) &&
            this.player.y < platform.sprite.y) {
          
          // Jump!
          this.playerVelocityY = this.jumpPower;
          
          // Handle platform types
          if (platform.type === 'broken') {
            platform.broken = true;
            platform.sprite.setTint(0x666666);
            this.tweens.add({
              targets: platform.sprite,
              alpha: 0,
              duration: 500,
              onComplete: () => {
                platform.sprite.destroy();
                const index = this.platforms.indexOf(platform);
                this.platforms.splice(index, 1);
              }
            });
          }
        }
      });
    }

    // Enemy collisions
    if (!this.isInvincible) {
      this.enemies.forEach(enemy => {
        const bounds = enemy.sprite.getBounds();
        const playerBounds = this.player.getBounds();
        
        if (Phaser.Geom.Rectangle.Overlaps(bounds, playerBounds)) {
          this.gameOver();
        }
      });
    }

    // Power-up collisions
    this.powerUps.forEach(powerUp => {
      const bounds = powerUp.sprite.getBounds();
      const playerBounds = this.player.getBounds();
      
      if (Phaser.Geom.Rectangle.Overlaps(bounds, playerBounds)) {
        this.collectPowerUp(powerUp);
      }
    });
  }

  private collectPowerUp(powerUp: PowerUp) {
    this.isInvincible = true;
    this.invincibilityTimer = powerUp.duration;
    
    // Remove power-up
    powerUp.sprite.destroy();
    const index = this.powerUps.indexOf(powerUp);
    this.powerUps.splice(index, 1);
  }

  private updateInvincibility() {
    if (this.isInvincible) {
      this.invincibilityTimer -= 16.67; // Assuming 60 FPS
      
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
    }
  }

  private generateNewContent() {
    const { width } = this.scale;
    const topPlatformY = Math.min(...this.platforms.map(p => p.sprite.y));
    
    // Generate new platforms above the highest existing platform
    if (topPlatformY > this.cameraY - 1000) {
      for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(40, width - 120);
        const y = topPlatformY - 120 - (i * 120);
        const type = this.getPlatformType();
        this.createPlatform(x, y, type);
        
        // Add enemies and power-ups
        if (Math.random() < 0.2) {
          if (Math.random() < 0.7) {
            this.createEnemy(x, y - 60);
          } else {
            this.createPowerUp(x, y - 60);
          }
        }
      }
    }
  }

  private cleanupOldObjects() {
    const cleanupY = this.cameraY + this.gameHeight + 200;
    
    // Remove platforms below screen
    this.platforms = this.platforms.filter(platform => {
      if (platform.sprite.y > cleanupY) {
        platform.sprite.destroy();
        return false;
      }
      return true;
    });
    
    // Remove enemies below screen
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.sprite.y > cleanupY) {
        enemy.sprite.destroy();
        return false;
      }
      return true;
    });
    
    // Remove power-ups below screen
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.sprite.y > cleanupY) {
        powerUp.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  private gameOver() {
    // Save high score
    if (this.score > this.highScore) {
      localStorage.setItem('snoo-jump-high-score', this.score.toString());
    }
    
    this.scene.start('GameOver', { score: this.score, highScore: Math.max(this.score, this.highScore) });
  }

  private updateLayout(width: number, height: number) {
    this.cameras.resize(width, height);
    this.gameHeight = height;
    
    if (this.scoreText) {
      this.scoreText.setPosition(width - 20, 20);
    }
    
    if (this.highScoreText) {
      this.highScoreText.setPosition(width - 20, 60);
    }
  }
}