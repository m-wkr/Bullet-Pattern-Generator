class Enemy {
    private _sprite:HTMLImageElement = <HTMLImageElement>document.getElementById('enemy');
    private _height:number = 100;
    private _width:number = 74;
    private _x:number = 500;
    private _y:number = 80;

    private _spawnCoord:number[] = [500,80];
    private _bullets:Bullet[] = [];
    private _bulletCooldown:number = 0;

    private _bulletFunction:Function;
    private _bulletArg:number[];
    private _bulletArgmanager:Function;

    public constructor(bulletFunction:Function,bulletArg:number[],bulletArgManager:Function) {
        this._bulletFunction = bulletFunction;
        this._bulletArg = bulletArg;
        this._bulletArgmanager = bulletArgManager;
    }

    public draw(surface:CanvasRenderingContext2D):undefined {
        surface.drawImage(this._sprite,this._x-(this._width/2),this._y-(this._height/2),this._width,this._height);
    }

    public bulletManagement(surface:CanvasRenderingContext2D,player:Player):undefined {
        //
        for (let i:number = this._bullets.length-1; i--; i >= 0) {
            this._bullets[i].update();
            if (player.bulletCollision(this._bullets[i].rectBorders)) {
                this._bullets.splice(i,1);
            } else {
                this._bullets[i].draw(surface);

            }
        }
    }

    public addBullet():undefined {
        if (this._bulletCooldown == 0) {
            this._bullets.push(new Bullet(this._spawnCoord[0],this._spawnCoord[1],this._bulletFunction,this._bulletArg,this._bulletArgmanager));
            this._bulletCooldown = 60;
        } else {
            this._bulletCooldown -= 1;
        }
    }
}

class Bullet {
    private _sprite:HTMLImageElement = <HTMLImageElement>document.getElementById('bullet');
    private _height:number = 9;
    private _width:number = 9;
    private _x:number
    private _y:number 
    private _borders:number[];

    private _dx:number = 1;
    private _dy:number = 1;
    private _movementFunction:Function;
    private _optionalArgs:number[];
    private _argsUpdater:Function;

    public constructor(x:number,y:number,movementFunction:Function,optionalArgs:number[],argsUpdater:Function) {
        this._x = x;
        this._y = y;
        this._borders = [this._y-(this._height/2),this._x+(this._width/2),this._y+(this._height/2),this._x-(this._width/2)];
        this._movementFunction = movementFunction;
        this._optionalArgs = optionalArgs;
        this._argsUpdater = argsUpdater;
    }

    // Returns top border, right border, bottom border, and left border
    get rectBorders():number[] {
        return this._borders;
    }

    public draw(surface:CanvasRenderingContext2D):undefined {
        surface.drawImage(this._sprite,this._x-(this._width/2),this._y-(this._height/2),this._width,this._height);
    }

    public update():undefined {
        [this._dx,this._dy] = this._movementFunction(this._optionalArgs);
        this._optionalArgs = this._argsUpdater(this._optionalArgs);
        this._x += this._dx;
        this._y += this._dy;
        this._borders = [this._y-(this._height/2),this._x+(this._width/2),this._y+(this._height/2),this._x-(this._width/2)];
    }

}