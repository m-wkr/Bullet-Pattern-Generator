// Okay so we can't run this since it uses document which isnt server-side, this'll be browser dependent instead
const canvas:HTMLCanvasElement= <HTMLCanvasElement>document.getElementById("canvas");
const ctx:CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
const bulletInput:HTMLFormElement = <HTMLFormElement>document.getElementById("b-type-options");
ctx.imageSmoothingEnabled = false;

let gameOccurrence:boolean = true;


let player = new Player();
let boss = new Enemy(anticlockwiseRotation,[0],degreeIncrementer);

let pressedKeys:{[key:string]:boolean} = {};

const recordPressedKeys = (eventKey:string) => {
    if (!("up" in pressedKeys) && (eventKey === 'w')) {
        pressedKeys["up"] = true;
    }
    if (!("left" in pressedKeys) && (eventKey === 'a')) {
        pressedKeys["left"] = true;
    }
    if (!("down" in pressedKeys) && (eventKey === 's')) {
        pressedKeys["down"] = true;
    }
    if (!("right" in pressedKeys) && (eventKey === 'd')) {
        pressedKeys["right"] = true;
    }
}

const recordUpKeys = (eventKey:string) => {
    if (eventKey === 'w') {
        delete pressedKeys['up']
    }
    if (eventKey === 'a') {
        delete pressedKeys['left']
    }
    if (eventKey === 's') {
        delete pressedKeys['down']
    }
    if (eventKey === 'd') {
        delete pressedKeys['right']
    }
}


function reset():undefined {
    player = new Player();
    let inputValue:number = parseInt(bulletInput.value);
    console.log(typeof inputValue);

    switch (inputValue) {
        case 0:
            console.log(0);
            boss = new Enemy(linearDown,[],() => {});
            break;
        case 1:
            console.log(1);
            boss = new Enemy(linearLeft,[],() => {});
            break;
        case 2:
            console.log(2);
            boss = new Enemy(linearRight,[],() => {});
            break;
        case 3:
            console.log(3);
            boss = new Enemy(anticlockwiseRotation,[0],degreeIncrementer);
            break;
        default:
            break;

    }

    gameOccurrence = true;
}


// main loop <3 
function main():undefined {
    window.requestAnimationFrame(main);
    if (gameOccurrence) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        player.updateKeyMovement(pressedKeys);
        player.updateDashProgress();
        player.updateBorderCoorindates();
        player.updateHpDrain();
        player.resetOutOfBoundCoords();
        player.updateBorderCoorindates();
        player.draw(ctx);

        boss.draw(ctx);
        boss.addBullet();
        boss.bulletManagement(ctx,player);
        player.healthDraw(ctx);

        if (player.getHp <= 0) {
            gameOccurrence = false;
        }
    
    }
}

main();

window.addEventListener("keydown", (event) => {recordPressedKeys(event.key);});
window.addEventListener("keyup", event => {recordUpKeys(event.key);});
canvas.addEventListener("mousedown", (event) => {player.dashInputUpdate(event)});