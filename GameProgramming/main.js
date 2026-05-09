const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#87ceeb",

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

let player;
let cursors;
let ground;
let platforms;
let stars;
let bombs;
let lastScaleMilestone = 0;
let score = 0;
let scoreText;
let gameOver = false;

const colors = [
    0xff0000,
    0xff7f00,
    0xffff00,
    0x00ff00,
    0x0000ff,
    0x4b0082,
    0x9400d3
];

let colorIndex = 0;

new Phaser.Game(config);

function preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("mainGround", "tiles/SandGround.png");

    this.load.spritesheet("platforms", "tiles/floating.png", {
        frameWidth: 384,
        frameHeight: 128
    });

    this.load.spritesheet("player", "assets/Character.png", {
        frameWidth: 64,
        frameHeight: 64
    });

    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
}

function create() {

    this.add.image(400, 300, "bg").setDisplaySize(800, 600);

    ground = this.physics.add.staticGroup();

    const base = ground.create(400, 580, "mainGround");

    base.setScale(800 / base.width, 100 / base.height);
    base.refreshBody();

    base.body.setSize(base.displayWidth, 30); 
    base.body.setOffset(0, base.displayHeight - 80);

    platforms = this.physics.add.staticGroup();

    const platformPositions = [
        { x: 200, y: 420 },
        { x: 600, y: 360 },
        { x: 400, y: 280 }
    ];

    platformPositions.forEach(pos => {
        const p = platforms.create(pos.x, pos.y, "platforms", 0);

        p.setScale(0.5);
        p.refreshBody();

        p.body.setSize(p.displayWidth, 20);
        p.body.setOffset(0, p.displayHeight - 20);
    });

    player = this.physics.add.sprite(100, 400, "player");

    player.setScale(1.5);
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    player.setSize(25, 5);
    player.setOffset(10, 70);

    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("player", { start: 10, end: 10 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player", { start: 9, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "jump",
        frames: [{ key: "player", frame: 11 }],
        frameRate: 10
    });

    player.play("idle");

    stars = this.physics.add.group();
    spawnStar(this);

    this.physics.add.collider(stars, ground);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, ground);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    scoreText = this.add.text(325, 20, "Stars: 0", {fontSize: "28px", color: "#ffc800", fontStyle: "bold"});
}

function update() {

    if (gameOver) return;

    let speed = 160;
    let moving = false;

    if (cursors.shift.isDown) speed = 280;

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.setFlipX(true);
        moving = true;
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.setFlipX(false);
        moving = true;
    }
    else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-520);
    }

    if (!player.body.blocked.down) {
        player.play("jump", true);
    }
    else if (moving) {
        player.play(speed > 200 ? "run" : "walk", true);
    }
    else {
        player.play("idle", true);
    }
}

function spawnStar(scene) {
    const x = Phaser.Math.Between(50, 750);
    const star = stars.create(x, 0, "star");

    star.setScale(0.5);
    star.setCircle(star.width / 2);
    star.setBounce(0.8);
    star.setCollideWorldBounds(true);
}

function collectStar(player, star) {

    star.destroy();
    score++;
    scoreText.setText("Stars: " + score);

    player.setTint(colors[colorIndex]);
    colorIndex = (colorIndex + 1) % colors.length;

    if (Math.floor(score / 5) > lastScaleMilestone) {
        lastScaleMilestone++;
        player.setScale(player.scaleX * 1.1);
    }

    spawnStar(this);

    const x = player.x < 400 ? Phaser.Math.Between(420, 780) : Phaser.Math.Between(20, 380);

    const bomb = bombs.create(x, 0, "bomb");

    bomb.body.setOffset(0, 70);
    bomb.setScale(0.5);
    bomb.setCircle(bomb.displayWidth / 2);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-220, 220), 20);
}

function hitBomb(player, bomb) {

    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.stop();

    gameOver = true;

    this.add.text(260, 250, "GAME OVER", {fontSize: "48px", color: "#ff0000", fontStyle: "bold"});
}