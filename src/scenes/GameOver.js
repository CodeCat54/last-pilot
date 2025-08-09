export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score;
    }


    create() {
        this.bg = this.physics.add.sprite(960, 540, 'screenEnd');
        this.scoreText = this.add.text(650, 750, 'Final score: ' + Math.round(this.score), { fontSize: '64px', fill: '#150' });

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }


    update() {
        if (this.keySpace.isDown) {
            //this.bg.destroy();
            //this.music.pause();
            this.scene.start('MainMenu');
        }
    }
}
