// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }


    create() {
            // Start screen bg image
            this.bg = this.add.sprite(960, 540, 'screenStart');

            this.music = new Audio('assets/mscMenu.ogg');
            this.music.loop = true;
            this.music.play();

            this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }


    update() {
        if (this.keySpace.isDown) {
            this.bg.destroy();
            this.music.pause();
            this.scene.start('Game');
        }
    }
}
