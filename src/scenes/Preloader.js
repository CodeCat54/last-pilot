export class Preloader extends Phaser.Scene {
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
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('screenStart', 'screenStart.png');
        this.load.image('screenEnd', 'screenEnd.png');
        this.load.image('player', 'player.png');
        this.load.image('star', 'star.png');
        this.load.image('bullet8', 'bullet8.png');
        this.load.image('bullet16', 'bullet16.png');
        this.load.image('bullet24', 'bullet24.png');
        this.load.image('bullet32', 'bullet32.png');
        this.load.image('bullet40', 'bullet40.png');
        this.load.image('bullet48', 'bullet48.png');
        this.load.image('bullet64', 'bullet64.png');
        this.load.image('gameBg', 'gameBg.png');
        this.load.audio('mscGame', 'mscGame.ogg');
        this.load.audio('mscMenu', 'mscMenu.ogg');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
