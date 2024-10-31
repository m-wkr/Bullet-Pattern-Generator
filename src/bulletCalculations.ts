const degToRad = (degree:number) => {
    return (degree/180) * Math.PI;
}

function linearDown():number[] {
    return [0,1];
}

function linearLeft():number[] {
    return [-1,0];
}
function linearRight():number[] {
    return [1,0];
}


function anticlockwiseRotation(degree:number[]):number[] {
    let radian:number = degToRad(degree[0]);
    return [Math.cos(radian), -Math.sin(radian)]
}

function degreeIncrementer(degree:number[]):number[] {
    if (degree[0] >= 360) {
        return [0];
    } else {
        return [degree[0] + 0.5];
    }
}

