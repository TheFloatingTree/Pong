const canvas =  { x: window.innerWidth / 2, y: window.innerHeight / 2, w: window.innerWidth, h: window.innerHeight };

function collisionCircle(x1, y1, r1, x2, y2, r2) {
    let dist = distance(x1, y1, x2, y2);
    
    if (dist < r1 + r2) {
        return true;
    } else {
        return false;
    }
}

function collisionRectangle(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((Math.abs(x1 - x2) * 2 < (w1 + w2)) && (Math.abs(y1 - y2) * 2 < (h1 + h2))) {
        return true;
    } else {
        return false;
    }
}

function removeFromArray(obj, arr) {
    let index = arr.indexOf(obj);
    arr.splice(index, 1);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// function random(min, max) {
//     return Math.random() * (max - min) + min;
// }

function randomBool() {
    return Math.round(Math.random())
}

function randomInArea(x, y, w, h) {
    let x1 = x - w / 2;
    let y1 = y - h / 2;
    let x2 = x + w / 2;
    let y2 = y + h / 2;
    let output = {x: random(x1, x2), y: random(y1, y2)};

    return output;
}

function distance(x1, y1, x2, y2) {
    let a = x1 - x2
    let b = y1 - y2

    return Math.sqrt( a*a + b*b );
}

function getAngle(x1, y1, x2, y2) {
    let dy = y2 - y1;
    let dx = x2 - x1;

    return Math.atan2(dy, dx);
}

function getVector(x1, y1, x2, y2) {
        let x = x1 - x2;
        let y = y1 - y2;

        if (x === 0 && y === 0) {
            return {x: x, y: y};
        }

        let hyp = Math.sqrt(x * x + y * y);

        x /= hyp;
        y /= hyp;

        return {x: -x, y: -y};
}

function repeatFunction(func, num) {
    for(let i = 0; i < num; i++) {
        func();
    }
}

function getRandomHexColor() {return "#" + Math.floor(Math.random()*16777215).toString(16)}

function clone(obj) {
    if( obj === null || typeof obj !== "object"){
        return obj;
    } else if (Array.isArray(obj)) {
        var clonedArr = [];
        obj.forEach(function(element) {
            clonedArr.push(clone(element));
        });
        return clonedArr;
    } else {
        let clonedObj = {};
        for (var prop in obj){
            if(obj.hasOwnProperty(prop)) { 
                clonedObj[prop] = clone(obj[prop]);
            }
        }
        return clonedObj;
    }
}

function tconstrain(val, min, max) {
    return (val > min) ? ((val < max) ? val : max) : min;
}