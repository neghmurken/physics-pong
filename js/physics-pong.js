var canvas = document.createElement('canvas');
canvas.id = 'pp';
canvas.width = window.innerWidth - (document.body.style.marginLeft + document.body.style.marginRight);
canvas.height = window.innerHeight - (document.body.style.marginTop + document.body.style.marginBottom);

var info = document.getElementById('info');

document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

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
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.lineJoin = 'bevel';
    
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
    mouseCenter = Vector.NIL,
    l = Math.sqrt(2 * Math.pow(80, 2));

actors[0] = physics.createBox(l, l, 80, canvas.width * 0.5, canvas.height * 0.5);

actors[2] = physics.createBall(40, 40, canvas.width * 0.5 + 90, canvas.height * 0.5 + 120);
actors[2].rotate(Angle.NORTHEAST);

actors[1] = physics.createBall(20, 20, canvas.width * 0.5 - 50, canvas.height * 0.5 - 200);
actors[1].velocity = new Vector(0, 160);

canvas.addEventListener('mousemove', function (e) {
    mouseCenter = new Vector(e.clientX, e.clientY);
});

canvas.addEventListener('mouseenter', function (e) {
    physics.start();
});

canvas.addEventListener('mouseleave', function (e) {
    physics.stop();
});

/* crappy. debug purpose only */
this.oncollision = function (coll) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(coll.impact.x, coll.impact.y);
    var iv = coll.normal.scale(20).add(coll.impact);
    ctx.lineTo(iv.x, iv.y);
    ctx.arc(iv.x, iv.y, 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
}

var paint = function () {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.37)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(paint);

    physics.update();

    for (i in actors) {
        printActor(actors[i]);
    }
};
window.requestAnimationFrame(paint);