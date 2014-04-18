/* jshint browser: true */
/* globals Physics:true, Vector:true, Angle:true */
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
    ctx.moveTo(points[0].x, canvas.height - points[0].y);

    for (cur in points) {
        next = (Number(cur) + 1) % count;
        ctx.lineTo(points[next].x, canvas.height - points[next].y);
    }
    
    ctx.closePath();
    ctx.stroke();
}

function printActor(actor) {
    var a;
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.lineJoin = 'bevel';
    
    switch (actor.type) {
        case 'box':
            printPolygon(actor.bounds());
            
            ctx.beginPath();
            ctx.moveTo(actor.center.x, canvas.height - actor.center.y);
            a = actor.center.add(actor.theta.toVector(actor.dimension.x / 2));
            ctx.strokeStyle = '#407fb5';
            ctx.lineTo(a.x, canvas.height - a.y);
            ctx.closePath();
            ctx.stroke();

            break;

        case 'ball':
            ctx.beginPath();
            ctx.arc(actor.center.x, canvas.height - actor.center.y, actor.radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(actor.center.x, canvas.height - actor.center.y);
            a = actor.center.add(actor.theta.toVector(actor.radius));
            ctx.strokeStyle = '#407fb5';
            ctx.lineTo(a.x, canvas.height - a.y);
            ctx.closePath();
            ctx.stroke();

            break;
    }
    
    // display aabb
//    var aabb = actor.aabb;
//    ctx.strokeStyle = '#4d4d2c';
//    ctx.beginPath();
//    ctx.moveTo(aabb.sw.x, canvas.height - aabb.sw.y);
//    ctx.lineTo(aabb.ne.x, canvas.height - aabb.sw.y);
//    ctx.lineTo(aabb.ne.x, canvas.height - aabb.ne.y);
//    ctx.lineTo(aabb.sw.x, canvas.height - aabb.ne.y);
//    ctx.lineTo(aabb.sw.x, canvas.height - aabb.sw.y);
//    ctx.closePath();
//    ctx.stroke();
    
    // display velocity
    ctx.strokeStyle = '#294a3c';
    ctx.beginPath();
    ctx.moveTo(actor.center.x, canvas.height - actor.center.y);
    var vel = actor.center.add(actor.velocity);
    ctx.lineTo(vel.x, canvas.height - vel.y);
    ctx.closePath();
    ctx.stroke();
}

var printKineticEnergy = function (actors) {
    var sum = 0;
    
    actors.map(function (v) {
        sum += v.getKineticEnergy();
    });
    
    ctx.fillStyle = '#fff';
    ctx.fillText('K : ' + (sum / 1000).toFixed(3).replace('.', ',') + ' kJ', 20, 15);
};

var physics = new Physics(canvas.width, canvas.height),
    actors = [],
    pos,
    random,
    mouseCenter = Vector.NIL;

actors[0] = physics.createBox(400, 10, 1e10, canvas.width * 0.5, canvas.height * 0.5 + 200);
actors[0].rotate(new Angle(Math.PI / 4), new Vector(canvas.width * 0.5, canvas.height * 0.5));
actors[1] = physics.createBox(10, 400, 1e10, canvas.width * 0.5 + 200, canvas.height * 0.5);
actors[1].rotate(new Angle(Math.PI / 4), new Vector(canvas.width * 0.5, canvas.height * 0.5));
actors[2] = physics.createBox(400, 10, 1e10, canvas.width * 0.5, canvas.height * 0.5 - 200);
actors[2].rotate(new Angle(Math.PI / 4), new Vector(canvas.width * 0.5, canvas.height * 0.5));
actors[3] = physics.createBox(10, 400, 1e10, canvas.width * 0.5 - 200, canvas.height * 0.5);
actors[3].rotate(new Angle(Math.PI / 4), new Vector(canvas.width * 0.5, canvas.height * 0.5));

for (var j = 0 ; j < 4 ; j++) {
    pos = new Vector(canvas.width * 0.5 + 100 + (25 * j), canvas.height * 0.5);
    for (var i = 0 ; i < 16 ; i++) {
        actors[(i + (j * 20)) + 4] = physics.createBall(10, 10, pos.x, pos.y);
        actors[(i + (j * 20)) + 4].velocity = (new Angle(Math.PI / 8 * i  + Math.PI)).toVector(50);
        pos = pos.rotate(new Angle(Math.PI / 8), new Vector(canvas.width * 0.5, canvas.height * 0.5));
    }
}

actors.push(physics.createBall(80, 800, canvas.width * 0.5, canvas.height * 0.5));

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
    ctx.strokeStyle = '#f44646';
    ctx.beginPath();
    var iv = coll.normal.scale(20).add(coll.impact),
        tg = coll.tangent().scale(20).add(coll.impact);
    
    ctx.moveTo(coll.impact.x, canvas.height - coll.impact.y);
    ctx.lineTo(iv.x, canvas.height - iv.y);
    
    ctx.moveTo(coll.impact.x, canvas.height - coll.impact.y);
    ctx.lineTo(tg.x, canvas.height - tg.y);
    
    ctx.closePath();
    ctx.stroke();
};

var paint = function () {
    ctx.fillStyle = 'rgba(51, 51, 51, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(paint);

    physics.update();

    for (var i in actors) {
        printActor(actors[i]);
    }
    
    printKineticEnergy(actors);
};
window.requestAnimationFrame(paint);