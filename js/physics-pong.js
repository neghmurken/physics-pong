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
    switch (actor.type) {
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
    actors = [],
    random,
    mouseCenter = Vector.NIL;

for (var i = 0 ; i < 20; i++) {
    actors[i] = physics.createBall(10, 1, (canvas.width / 20) * Math.random() * 20, (canvas.height / 20) * Math.random() * 20);
    actors[i].velocity = new Vector(Math.random() * 80 - 40, Math.random() * 80 - 40);
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

    for (i in actors) {
        printActor(actors[i]);
    }
};
window.requestAnimationFrame(paint);