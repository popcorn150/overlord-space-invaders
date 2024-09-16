//board 
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns // 32 * 16
let boardHeight = tileSize * rows // 32 * 16
let context;

//hero
let heroWidth = tileSize * 2;
let heroHeight = tileSize;
let heroX = tileSize * columns / 2 - tileSize;
let heroY = tileSize * rows - tileSize * 2;

let hero = {
    x: heroX,
    y: heroY,
    width: heroWidth,
    height: heroHeight,
    active: true
}

let heroImg;
let heroVelocityX = 1.3; // ship moving speed

//aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1.3; //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

window.onload = function () {
    board = document.getElementById("game-board");

    board.width = boardWidth;
    board.height = boardHeight
    context = board.getContext("2d"); // used for drawing on the board

    //load hero
    heroImg = new Image();
    heroImg.src = "/imgs/hero.svg"
    heroImg.onload = function () {
        context.drawImage(heroImg, hero.x, hero.y, hero.width, hero.height);
    }


    //load aliens
    alienImg = new Image();
    alienImg.src = "/imgs/alien.svg"

    createAliens();

    requestAnimationFrame(update);

    // document.addEventListener("keydown", moveHero);
    board.addEventListener("touches", handleTap);
    document.addEventListener("keyup", shoot);
}

function update() {
    requestAnimationFrame(update);

    //clear game board after ship movement
    context.clearRect(0, 0, board.width, board.height);

    //drawing the ship again after each movement
    if (hero.active) {
        hero.x -= heroVelocityX;

        //if hero touches border
        if (hero.x + hero.width >= board.width || hero.x <= 0) {
            heroVelocityX *= -1;
        }
        context.drawImage(heroImg, hero.x, hero.y, hero.width, hero.height);
    }

    //draw aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            //if alien touches border
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                //move all aliens up by one row
                for (let j = 0; i < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(
                alienImg, alien.x, alien.y, alien.width, alien.height
            );
        }
    }


    //drawing the bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //removes the first element of the array
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (e.code == "Space") {
        //shoot
        let bullet = {
            x: hero.x + heroWidth * 15 / 32,
            y: hero.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        }
        bulletArray.push(bullet);
    }
}

function handleTap(e) {
    e.preventDefault();
    shoot();
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && //a's top right corner passes b's top left corner
        a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}


// Function to update the progress bar
function updateProgressBar(progressBar, value) {
    value = Math.round(value);
    progressBar.querySelector(".progress__fill").style.width = `${value}%`;
    progressBar.querySelector(".progress__text").textContent = `${value}%`;
}

// Function to animate the progress bar from 0 to 100
function animateProgressBar(progressBar, duration) {
    let value = 0
    const internalDuration = duration / 100; // Time to increment each percentage

    // Disable the start button initially
    const startButton = document.getElementById('startButton');
    startButton.disabled = true;

    const interval = setInterval(() => {
        if (value >= 100) {
            clearInterval(interval)

            // Enable the start button when progress is 100%
            startButton.disabled = false;

            // Add pulse animation to button
            startButton.classList.add('pulse');
        } else {
            value++;
            updateProgressBar(progressBar, value);
        }
    }, internalDuration);
}

// Select the progress bar element
const pgBar = document.querySelector(".progress");

// Start the animation for 5 seconds (5000 milliseconds)
animateProgressBar(pgBar, 5000);

let popup = document.getElementById("popUp");

function openPopup() {
    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
}
