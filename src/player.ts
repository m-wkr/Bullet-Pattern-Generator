class Player {
    private _sprite:HTMLImageElement = <HTMLImageElement>document.getElementById('player');
    private _height:number = 33;
    private _width:number = 17;
    private _x:number = 500; 
    private _y:number = 400;

    private _instantDmgBorder:number[] = [this._y-(this._height/2)+5,this._x+(this._width/2)-5,this._y+(this._height/2-5),this._x-(this._width/2)+5];
    private _corrosionDmgBorder:number[] = [this._y-(this._height/2),this._x+(this._width/2),this._y+(this._height/2),this._x-(this._width/2)];

    private _maxHp:number = 100;
    private _hp:number = 100; 
    private _instantDmgHp:number = 100;
    private _corrosionDmgHp:number = 100;
    private _invincibility:boolean = false;

    private _instantBuffer:number = 0;
    private _corrosionBuffer:number = 0;

    private _dashCooldown:number = 0; //Max is set to 120 for now
    private _dashX:number = 0;
    private _dashY:number = 0;
    private _dProgress:number = 0; //Max is 3


    public get getHp():number {
        return this._hp;
    }

    public updateKeyMovement(eventKeys:{[index:string]:boolean}):undefined {
        for (let key in eventKeys) {
            if (key === 'up') { 
                this._y -= 2; 
            }
            if (key === 'left') {
                    this._x -= 2;
            }
            if (key === 'down') {
                this._y += 2;
            }
            if (key === 'right') {
                    this._x += 2;
            }
        }
    }

    public updateDashProgress():undefined {
        // Default integral area is 27/8
        if (this._dProgress + 0.15 <= 3 && this._dashCooldown > 0) {
            const distanceQuartic = (x:number) => {return (1/8)*(x**4) - (x**3) + ((9/4)*(x**2))};
            this._x += 8*this._dashX*(distanceQuartic(this._dProgress+0.15)-distanceQuartic(this._dProgress))/27;
            this._y += 8*this._dashY*(distanceQuartic(this._dProgress+0.15)-distanceQuartic(this._dProgress))/27;
            this._dProgress += 0.15;
        } else {
            this._invincibility = false;
        }

        if (this._dashCooldown > 0) {
            this._dashCooldown -= 1;
        }
        
    }

    public updateBorderCoorindates():undefined {
        // Updating damage borders to current player position
        this._instantDmgBorder= [this._y-(this._height/2)+5,this._x+(this._width/2)-5,this._y+(this._height/2-5),this._x-(this._width/2)+5];
        this._corrosionDmgBorder = [this._y-(this._height/2),this._x+(this._width/2),this._y+(this._height/2),this._x-(this._width/2)];
    }

    public resetOutOfBoundCoords():undefined {
        if (this._corrosionDmgBorder[0] < 0) {
            this._y = 16.5;
        }

        if (this._corrosionDmgBorder[1] > 1000) {
            this._x = 991.5;
        }

        if (this._corrosionDmgBorder[2] > 560) {
            this._y = 543.5;
        }

        if (this._corrosionDmgBorder[3] < 0) {
            this._x = 8.5;
        }
    }

    public updateHpDrain():undefined {
        // Facilitate hp drain animation
        if (this._corrosionBuffer && this._hp < this._corrosionDmgHp) {
            this._corrosionBuffer -= (2/10);
            this._corrosionDmgHp -= (2/10);
        }

        if (this._instantBuffer && this._hp < this._instantDmgHp) {
            this._instantBuffer -= 1/5;
            this._instantDmgHp -= 1/5;
            this._corrosionDmgHp -= 1/5;
        }        
    }
    
    
    public dashInputUpdate(mouse:MouseEvent):undefined {
        if (this._dashCooldown == 0) { 
            let dX:number = (mouse.pageX - $("canvas").offset()!.left) - this._x;
            let dY:number = (mouse.pageY - $("canvas").offset()!.top) - this._y;

            let ratio:number = dY/dX;
            let diagonalDistanceSquared:number = dX**2 + dY**2;

            if (diagonalDistanceSquared > 40000) {
                let x:number = Math.sqrt(40000/(1+ratio**2));
                let y:number = Math.abs(ratio) * x;

                if (dX/-1 < 0) {
                    this._dashX = x;
                } else {
                    this._dashX = -x;
                }

                if (dY/-1 < 0) {
                    this._dashY = y;
                } else {
                    this._dashY = -y;
                }
                
            } else {
                this._dashX = dX;
                this._dashY = dY;
            }

            this._dashCooldown = 120;
            this._dProgress = 0;
            this._invincibility = true;
        } 
    }


    public bulletCollision(enemyBorders:number[]):boolean {
        if (!(enemyBorders[2] < this._instantDmgBorder[0] || enemyBorders[0] > this._instantDmgBorder[2] ||
            enemyBorders[1] < this._instantDmgBorder[3] ||enemyBorders[3] > this._instantDmgBorder[1])) {
            if (!this._invincibility) {
                if (this._hp - 2 >= 0) {
                    this._hp -= 2;
                    this._corrosionDmgHp -= 2;
                    this._instantBuffer += 2;
                } else {
                    this._hp = 0;
                }
                return true
            }
        } else if (!(enemyBorders[2] < this._corrosionDmgBorder[0] || enemyBorders[0] > this._corrosionDmgBorder[2] ||
            enemyBorders[1] < this._corrosionDmgBorder[3] ||enemyBorders[3] > this._corrosionDmgBorder[1])) {
            if (!this._invincibility) {
                if (this._hp - 5 >= 1) {
                    this._hp -= 5;
                    this._instantDmgHp -= 5;
                    this._corrosionBuffer += 5;
                } else {
                    this._hp = 1;
                    this._instantDmgHp = 1;
                }
            }
        }
        
        return false;
    }

    public draw(surface:CanvasRenderingContext2D):undefined {
        surface.drawImage(this._sprite,this._x-(this._width/2),this._y-(this._height/2),this._width,this._height);

    }

    public healthDraw(surface:CanvasRenderingContext2D):undefined {
        surface.fillStyle = "#4B0B0B";
        surface.fillRect(880,20,this._maxHp,20);
        surface.fillStyle = "#EFBEBE";
        surface.fillRect(880,20,this._corrosionDmgHp,20);
        surface.fillStyle = "#FCEEEE";
        surface.fillRect(880,20,this._instantDmgHp,20);
        surface.fillStyle = "Red";
        surface.fillRect(880,20,this._hp,20);
    }
}