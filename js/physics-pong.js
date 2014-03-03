var canvas = document.createElement('canvas');
canvas.id = 'pp';
canvas.width = window.innerWidth - (document.body.style.marginLeft + document.body.style.marginRight);
canvas.height = window.innerHeight - (document.body.style.marginTop + document.body.style.marginBottom);

var info = document.getElementById('info');

document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;
ctx.lineJoin = 'bevel';

function printPolygon(points) {
    var cur, next, count = points.length;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (cur in points) {
        next = (Number(cur) + 1) % count;
        ctx.lineTo(points[next].x, points[next].y);
    }

    ctx.closePath();
    ctx.stroke();
}

function printActor(actor) {
    switch(actor.type) {
        case 'box':
            printPolygon(actor.bounds());
            break;
            
        case 'ball':
            ctx.beginPath();
            ctx.arc(actor.center.x, actor.center.y, actor.radius, 0, 2 * Math.PI, false);
            ctx.closePath();

            ctx.stroke();
            break;
    }
}

var physics = new Physics(canvas.width, canvas.height),
    balls = [],
    random,
    mouseCenter = Vector.NIL;

for (var i = 0 ; i < 2; i++) {
    random = Math.random() * 1.1;
    balls[i] = physics.createBall(random + 20, 4000, canvas.width * Math.random(), canvas.height * Math.random());
    balls[i].velocity = (new Vector(canvas.width / 2, canvas.height / 2)).sub(balls[i].center).norm().scale(250);
}



canvas.addEventListener('mousemove', function (e) {
    mouseCenter = new Vector(e.clientX, e.clientY); 
});

canvas.addEventListener('mouseenter', function (e) {
    physics.start();
});

canvas.addEventListener('mouseleave', function (e) {
    physics.stop();
});

var paint = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(paint);
    
    physics.update();

    for (i in balls) {
        printActor(balls[i]);
    }
};
window.requestAnimationFrame(paint);



