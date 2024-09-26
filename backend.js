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

let score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("game-board");
    let mainTab = document.getElementById("mainTab");


    board.width = boardWidth;
    board.height = boardHeight;
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

    mainTab.classList.add("mainTab");
    board.addEventListener("touchstart", handleTap);
    document.addEventListener("keydown", shoot);
};

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

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

            if (alien.y >= hero.y) {
                gameOver = true;
            }
        }
    }


    //drawing the bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "red";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    //clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //removes the first element of the array
    }

    //next level
    if (alienCount == 0) {
        //increase the number of aliens in columns and rows by one
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); //cap @ 16 / 2 - 2 = 6
        alienRows = Math.min(alienRows + 1, rows - 4);//alien don't exceedd up to 4 rows of the canva (cap @ 16 - 4 = 12)
        alienVelocityX += 0.2; //increase alien's speed on each new level
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    context.fillStyle = "red";
    context.font = "20px Share Tech Mono";
    context.fillText(score, 20, 30);
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

    if (gameOver) {
        return;
    }

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

document.getElementById("openAlert").addEventListener("click", function () {
    let inviteID = generateRandomID();

    copyToClipboard(inviteID);

    let alert = document.getElementById("showAlert");
    if (alert) {
        alert.classList.remove("hide");
        alert.classList.add("show");
        alert.classList.add("showAlert");
        setTimeout(function () {
            alert.classList.add("hide");
            alert.classList.remove("show");
        }, 5000);
    } else {
        console.log("Element with ID 'showAlert' not found.")
    }
});

document.getElementById("closeAlert").addEventListener("click", function () {
    let alert = document.getElementById("showAlert");
    if (alert) {
        alert.classList.add("hide");
        alert.classList.remove("show");
    } else {
        console.log("Element with ID 'showAlert' not found.")
    }
});

//generate random invite id
function generateRandomID() {
    //customazie the ID length and characters as needed
    let length = 10;
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomID = "";

    for (let i = 0; i < length; i++) {
        randomID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomID;
};

//copy to clipboard automatically
function copyToClipboard(text) {
    //create a temporary input element
    let tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.append(tempInput);

    //select the text and copy it
    tempInput.select()
    tempInput.setSelectionRange(0, 99999); //for mobile devices
    document.execCommand("copy");

    //remove the temporary input element
    document.body.removeChild(tempInput);
};


function loadPage(page) {
    fetch(page)
        .then(Response => Response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
        })
        .catch(error => console.log('Error loading page:', error));
}


// Check for existing player ID or create a new one
// let playerId = localStorage.getItem('playerId');
// if (!playerId) {
//     playerId = 'player_' + Math.random().toString(36).substring(2, 9);
//     localStorage.setItem('playerId', playerId);
// }
