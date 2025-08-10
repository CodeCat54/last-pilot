export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }


    create() {
        this.gameBg = this.add.sprite(960, 540, 'gameBg');

        // Bullet and star collision groups
        this.bullets = this.physics.add.group();
        this.stars = this.physics.add.group();
        this.boundaries = this.physics.add.group();

        var boundary1 = this.boundaries.create(-100, 600, 'boundaryVertical');
        var boundary2 = this.boundaries.create(2000, 600, 'boundaryVertical');
        var boundary3 = this.boundaries.create(960, 1200, 'boundaryHorizontal');

        // Player creation and collision
        this.player = this.physics.add.sprite(960, 900, 'player');
        this.player.setCollideWorldBounds(true);

        // Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Display score
        this.score = 1000;
        this.scoreText = this.add.text(835, 10, 'Score: 0', { fontSize: '48px', fill: '#ffffff' });

        // Start music
        this.music = new Audio('assets/mscGame.ogg');
        this.music.loop = true;
        this.music.play();

        // Collide the player with bullets and stars
        this.physics.add.overlap(this.player, this.bullets, this.hitBullet, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.bullets, this.boundaries, this.destroyBullet, null, this);

        // Used to prevent infinite loops on death
        this.gameOver = false;

        this.difficulty = 0;

        // Initiate bullet and star loops
        this.scoreTimer = setInterval(this.addScore, 100, this, 1);
        this.startGame();
    }
    
    startGame() {
        var gameOver = false;
        var valid = true

        // Call faster based on score
        this.bulletTimer = setTimeout(this.spawnBullet, 75, this);
        this.starTimer = setTimeout(this.spawnStar, 3000+this.score, this);
    }


    spawnBullet(context) {
        //Spawn randomly at the top of the screen
        var x = Phaser.Math.Between(0,1920);

        // Assign random direction as a function of angle; always point downwards or down-diagonal 
        var degrees = Phaser.Math.Between(135,225);
        var angle = degrees * (Math.PI/180);
        var dirX = -(Math.sin(angle)) * 300;
        var dirY = -(Math.cos(angle)) * 300;
        var sizes = [];

        // Difficulty decides bullet size pool
        switch(context.difficulty) {
            case 0:
                sizes = ["8"];
                break;

            case 1:
                sizes = ["8", "16"];
                break;

            case 2:
                sizes = ["8", "16", "24"];
                break;

            case 3:
                sizes = ["8", "16", "24", "32"];
                break;

            case 4:
                sizes = ["8", "16", "24", "32", "40"];
                break;

            case 5:
                sizes = ["8", "16", "24", "32", "40", "48"];
                break;

            case 6:
                sizes = ["8", "16", "24", "32", "40", "48", "64"];
                break;
         }

        // Choose random bullet size
        var bulletType = sizes[Math.random() * sizes.length | 0];
        var bulletSize = ''

        // Pick random bullet to spawn from available; break to avoid spawning multiple bullets at once
        switch(bulletType) {
            case "8":
                bulletSize = 'bullet8';
                break;
                
            case "16":
                bulletSize = 'bullet16';
                break;

            case "24":
                bulletSize = 'bullet24';
                break;

            case "32":
                bulletSize = 'bullet32';
                break;
                
            case "40":
                bulletSize = 'bullet40';
                break;

            case "48":
                bulletSize = 'bullet48';
                break;

            case "64":
                bulletSize = 'bullet64';
                break;
        }
        var bullet = context.bullets.create(x, 0, bulletSize);
        bullet.setVelocityX(dirX);
        bullet.setVelocityY(dirY);
        console.log(75*(1-(Math.log10(2)/1000))^context.score);
        context.bulletTimer = setTimeout(context.spawnBullet, 75*(1-(Math.log10(2)/1000))^context.score, context);
    }


    spawnStar(context) {
        // Spawn randomly anywhere on the screen; not too close to the bullet spawn point or edge borders
        var x = Phaser.Math.Between(200,1870);
        var y = Phaser.Math.Between(200,1030);
        var star = context.stars.create(x, y, 'star');

        if (!context.gameOver) {
            context.starTimer = setTimeout(context.spawnStar, 3000+context.score, context)
        }
    }


    hitBullet(player, bullet) {
        // 5 seconds after dying (bullet disappearance time) display end screen, show final score
        player.disableBody(true, true);
        this.gameOver = true;
        clearInterval(this.scoreTimer);
        clearTimeout(this.starTimer);
        clearTimeout(this.bulletTimer);
        this.music.pause();
        this.sfx = new Audio('assets/sfxPlayerDeath.ogg');
        this.sfx.play();
        setTimeout(this.displayEnd, 2000, this);
    }


    collectStar(player, star) {
        star.destroy()
        this.sfx = new Audio('assets/sfxStar.ogg');
        this.sfx.play();

        // Stars are worth more based on the player's current score; late game stars are more valuable but harder to collect
        this.addScore(this, 10 + this.score/50)
    }


    destroyBullet(bullet, boundary) {
        // Garbage collect bullets when leaving play area
        bullet.destroy()
    }


    displayEnd(context) {
        context.gameBg.destroy();
        context.scene.start('GameOver', {score: context.score});
    }


    addScore(context, amount) {
        context.score += amount
        context.scoreText.setText('Score: ' + Math.round(context.score));
        var boundary = 0
        var newDifficulty = 0
        var maxDifficulty = false;
        switch(context.difficulty) {
            case 0:
                boundary = 200;
                newDifficulty = 1;
                break;

            case 1:
                boundary = 400;
                newDifficulty = 2;
                break;

            case 2:
                boundary = 600;
                newDifficulty = 3;
                break;

            case 3:
                boundary = 900;
                newDifficulty = 4;
                break;

            case 4:
                boundary = 1200;
                newDifficulty = 5;
                break;

            case 5:
                boundary = 1500;
                newDifficulty = 6;
                break;
                
            case 6:
                maxDifficulty = true;
                break;
        }
        if(context.score >= boundary && !maxDifficulty) {
            context.difficulty = newDifficulty;
            context.sfx = new Audio('assets/sfxDifficultyIncrease.ogg');
            context.sfx.play();
        }
    }


    update() {
        // Player movement
        if (this.keyShift.isDown) {
            this.player.setVelocityX(-200*((this.cursors.left.isDown | this.keyA.isDown) - (this.cursors.right.isDown | this.keyD.isDown)));
            this.player.setVelocityY(-200*((this.cursors.up.isDown | this.keyW.isDown) - (this.cursors.down.isDown | this.keyS.isDown)));
        }
        else {
            this.player.setVelocityX(-400*((this.cursors.left.isDown | this.keyA.isDown) - (this.cursors.right.isDown | this.keyD.isDown)));
            this.player.setVelocityY(-400*((this.cursors.up.isDown | this.keyW.isDown) - (this.cursors.down.isDown | this.keyS.isDown)));
        }
    }
}
