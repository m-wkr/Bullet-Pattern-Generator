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

function clockwiseRotation(degree:number[]):number[] {
    let radian:number = degToRad(degree[0]);
    return [Math.cos(radian), Math.sin(radian)]
}

function roseCurve(degree:number[]):number[] {
    let radian:number = degToRad(degree[0]);
    return [150*Math.cos(4*radian)*Math.cos(radian),150*Math.cos(4*radian)*Math.sin(radian)]
}

function archimedesCurve(degree:number[]):number[] {
    let radian:number = degToRad(degree[0]);
    return [4*radian*Math.cos(radian),4*radian*Math.sin(radian)]
}

function butterflyCurve(degree:number[]):number[] {
    let radian:number = degToRad(degree[0]);
    return [120*Math.sin(radian)*(Math.E**Math.cos(radian) - 2*Math.cos(4*radian) - (Math.sin(radian/12))**5),120*Math.cos(radian)*(Math.E**Math.cos(radian) - 2*Math.cos(4*radian) - (Math.sin(radian/12))**5)]
}


function degreeIncrementer(degree:number[]):number[] {
    let newDegree = degree.slice(1);
    if (degree[0] >= degree[1] && degree[1] != -1) {
        newDegree.unshift(0);
        return newDegree;
    } else {
        degree[0] = degree[0] + 0.5
        newDegree.unshift(degree[0]);
        return newDegree;
    }
}
