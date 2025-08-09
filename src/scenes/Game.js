export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }


    create() {

        this.gameBg = this.add.sprite(960, 540, 'gameBg');

        // Bullet and star collision groups
        this.bullets = this.physics.add.group();
        this.stars = this.physics.add.group();

        // Player creation and collision
        this.player = this.physics.add.sprite(960, 900, 'player');
        this.player.setCollideWorldBounds(true);

        // Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Display score
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '48px', fill: '#255' });

        // Start music
        this.music = new Audio('assets/mscGame.ogg');
        this.music.play();

        // Collide the player with bullets and stars
        this.physics.add.overlap(this.player, this.bullets, this.hitBullet, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Used to prevent infinite loops on death
        this.gameOver = false;

        // Initiate bullet and star loops
        this.startGame();
    }
    
    startGame() {
        var gameOver = false;
        var valid = true

        // Call faster based on score
        setTimeout(this.spawnBullet, 100-this.score/20, this)
        setTimeout(this.spawnStar, 3000+this.score, this)
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

        // Every 200 score, add the next bullet size up to the random pool
        if (context.score < 200) {
            sizes = ["8"];
        }

        else if (context.score >= 200 && context.score < 400) {
                sizes = ["8", "16"];
        }

        else if (context.score >= 400 && context.score < 600) {
                sizes = ["8", "16", "24"];
        }

        else if (context.score >= 600 && context.score < 800) {
                sizes = ["8", "16", "24", "32"];
        }

        else if (context.score >= 800 && context.score < 1000) {
                sizes = ["8", "16", "24", "32", "40"];
        }

        else if (context.score >= 1000 && context.score < 1500) {
                sizes = ["8", "16", "24", "32", "40", "48"];
        }

        else if (context.score >= 1500) {
                sizes = ["8", "16", "24", "32", "40", "48", "64"];
        }

        // Choose random bullet size
        var bulletType = sizes[Math.random() * sizes.length | 0];
        var bulletSize = ''

        // Pick random bullet to spawn from available; break to avoid spawning multiple bullets at once
        switch (bulletType) {
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

        if (!context.gameOver) {
            setTimeout(context.spawnBullet, 100-context.score/20, context)
        }
    }


    spawnStar(context) {
        // Spawn randomly anywhere on the screen; not too close to the bullet spawn point or edge borders
        var x = Phaser.Math.Between(200,1870);
        var y = Phaser.Math.Between(50,1030);
        var star = context.stars.create(x, y, 'star');

        if (!context.gameOver) {
            setTimeout(context.spawnStar, 3000+context.score, context)
        }
    }


    hitBullet(player, bullet) {
        // 5 seconds after dying (bullet disappearance time) display end screen, show final score
        player.destroy();
        this.gameOver = true;
        setTimeout(this.displayEnd, 5000, this);
    }


    collectStar(player, star) {
        star.destroy()

        // Stars are worth more based on the player's current score; late game stars are more valuable but harder to collect
        this.score += 10 + (this.score/50);
        this.scoreText.setText('Score: ' + Math.round(this.score));
    }


    displayEnd(context) {
        context.gameBg.destroy();
        context.music.pause();
        context.scene.start('GameOver', {score: context.score});
    }


    update() {
        // If game over, don't allow player movement
        if (this.gameOver) {
            return;
        }

        // Player movement
        if (this.keyShift.isDown) {
            this.player.setVelocityX(-200*(this.cursors.left.isDown-this.cursors.right.isDown))
            this.player.setVelocityY(-200*(this.cursors.up.isDown-this.cursors.down.isDown))
        }
        else {
            this.player.setVelocityX(-400*(this.cursors.left.isDown-this.cursors.right.isDown))
            this.player.setVelocityY(-400*(this.cursors.up.isDown-this.cursors.down.isDown))
        }

        // Add 0.1 score every step, round to nearest integer and display
     //   score += 0.1
     //   scoreText.setText('Score: ' + Math.round(score));
    }
}
