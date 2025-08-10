export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score;
    }


    create() {
        this.bg = this.physics.add.sprite(960, 540, 'screenEnd');
        this.scoreText = this.add.text(1100, 671, Math.round(this.score), { fontSize: '36px', fill: '#ffffff', fontStyle: 'Bold' });

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.music = new Audio('assets/mscGameOver.ogg');
        this.music.loop = true;
        this.music.play();
    }


    update() {
        if (this.keyR.isDown) {
            //this.bg.destroy();
            this.music.pause();
            this.scene.start('MainMenu');
        }
    }
}
