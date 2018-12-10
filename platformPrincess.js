import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("water.png", 500, 0);



class Wall extends Sprite {
    constructor(x, y) {
        super();
        this.name = "Wall";
        this.setImage("wall.png");
        this.x = x;
        this.y = y;
        this.accelerateOnBounce = false;
    }
}

new Wall(0, 175, "Wall", "wall.png");

class Support extends Sprite {
    constructor(x, y, image) {
        super();
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}

class Platform extends Support {
    constructor(x, y, image) {
        super(x, y, image);
        this.name = "A platform";
        this.accelerateOnBounce = false;
    }
}

let startPlatform = new Platform(0, 400, "start.png");
let finishPlatform = new Platform(704, 400, "finish.png");
new Platform(0, 400, "start.png");
new Platform(game.displayWidth - 48 * 2, 400, "finish.png");

class Slider extends Support {
    constructor(x, y, angle) {
        super(x, y);
        this.setImage("slider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 48;
        this.accelerateOnBounce = true;
    }
}

new Slider(startPlatform.x + 48 * 3, startPlatform.y + 48, 0);
new Slider(finishPlatform.x - 48 * 5, finishPlatform.y + 48, 180);


class Princess extends Sprite {
    constructor() {
        super();
        this.name = "Princess ann";
        this.setImage("ann.png");
        this.x = 48;
        this.y = 300;
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.isFalling = false;
    }
    handleLeftArrowKey() {
        this.speed = this.speedWhenWalking;
        this.angle = 180;
        this.playAnimation("left", false);
    }
    handleRightArrowKey() {
        this.speed = this.speedWhenWalking;
        this.angle = 0;
        this.playAnimation("right", false);
    }
    handleGameLoop() {
        this.x = Math.max(5, this.x);
        if (this.angle == 0 && this.speed > 0) {
            this.playAnimation("right");
        }
        if (this.angle == 180 && this.speed < 0) {
            this.playAnimation("left");
        }
        this.isFalling = false;
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Support);
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true;
            this.y = this.y + 4;
        }
    }
    handleSpacebar() {
        if (!this.isFalling) {
            this.y = this.y - 1.25 * this.height;
        }
    }
    handleBoundryContact() {
        game.end("Princess Ann has drowned.\n\nBetter luck next time.");
        this.true;
    }
}

let ann = new Princess();

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = 310;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            game.end("Congratulations!\n\nPrincess Ann can now pursue the\nstranger deeper into the castle");
        }
    }
}

let exit = new Door();
exit.name = "The exit";

class Spider extends Sprite {
    constructor(x, y) {
        super();
        this.name = "spider";
        this.setImage("spider.png");
        this.x = x;
        this.y = y;
        this.speed = 48;
        this.accelerateOnBounce = false;
        this.defineAnimation("creep", 0, 3);
        this.playAnimation("creep", true);
    }
    handleGameLoop() {
        if (this.y < ann.y) {
            this.angle = 270;
        if (this.y > ann.y) {
                this.angle = 90;
            }
        }
    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            let horizontalOffset = this.x - otherSprite.x;
            let verticalOffset = this.y - otherSprite.y;
            if (Math.abs(horizontalOffset) < this.width / 2 &&
                Math.abs(verticalOffset) < 30) {
                otherSprite.y = otherSprite.y + 1;
            }
        }
        return false;
    }
}


new Spider(200, 225);
new Spider(550, 200);

class Bat extends Sprite {
    constructor(x, y) {
        super();
        this.setImage("bat.png");
        this.name = " A scary bat";
        this.x = x;
        this.y = y;
        this.accelerateOnBounce = false;
        this.defineAnimation("flap", 0, 1);
        this.playAnimation("flap", true);
        this.attackSpeed = 300;
        this.speed = this.normalSpeed = 20;
        this.angle = 45 + Math.round(Math.random() * 3) * 90;
        this.angleTimer = 0;
        this.x = this.startX = x;
        this.y = this.startY = y;
    }
    attack() {
        this.aimFor(ann.x, ann.y);
        this.speed = this.attackSpeed;
    }
    handleGameLoop() {
        if (Math.random() <= 0.005) {
            this.attack();
            if (this.speed === Math.round(this.normalSpeed)) {
                let now = game.getTime();
                if (now - this.angleTimer >= 2) {
                    this.angleTimer = now;
                }
            }
        }
    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            let horizontalOffset = this.x - otherSprite.x;
            let verticalOffset = this.y - otherSprite.y;
            if (Math.abs(horizontalOffset) < this.width / 2 &&
                Math.abs(verticalOffset) < 30) {
                otherSprite.y = otherSprite.y + 1;
            }
        }
        return false;
    }
}

let leftBat = new Bat(200, 100);
let rightBat = new Bat(500, 75);
