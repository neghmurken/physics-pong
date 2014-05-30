/* jshint browser: true */
/* globals Physics:true, Vector:true, Angle:true */
var canvas = document.createElement('canvas');
canvas.id = 'pp';
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

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
        case 'point':
            ctx.beginPath();
            ctx.arc(actor.center.x, canvas.height - actor.center.y, 1, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
            break;

        case 'box':
            printPolygon(actor.bounds());
            
//            ctx.beginPath();
//            ctx.moveTo(actor.center.x, canvas.height - actor.center.y);
//            a = actor.center.add(actor.theta.toVector(actor.dimension.x / 2));
//            ctx.strokeStyle = '#407fb5';
//            ctx.lineTo(a.x, canvas.height - a.y);
//            ctx.closePath();
//            ctx.stroke();

            break;

        case 'ball':
            ctx.beginPath();
            ctx.arc(actor.center.x, canvas.height - actor.center.y, actor.radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
            
//            ctx.beginPath();
//            ctx.moveTo(actor.center.x, canvas.height - actor.center.y);
//            a = actor.center.add(actor.theta.toVector(actor.radius));
//            ctx.strokeStyle = '#407fb5';
//            ctx.lineTo(a.x, canvas.height - a.y);
//            ctx.closePath();
//            ctx.stroke();

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
//    ctx.strokeStyle = '#294a3c';
//    ctx.beginPath();
//    ctx.moveTo(actor.center.x, canvas.height - actor.center.y);
//    var vel = actor.center.add(actor.velocity);
//    ctx.lineTo(vel.x, canvas.height - vel.y);
//    ctx.closePath();
//    ctx.stroke();
}

var printKineticEnergy = function (actors) {
    var sum = 0;
    
    actors.map(function (v) {
        sum += v.getKineticEnergy();
    });
    
    ctx.fillStyle = '#fff';
    ctx.fillText('K : ' + (sum / 1000).toFixed(3).replace('.', ',') + ' kJ', 5, 15);
};

var printCollisionCount = function (count) {
    ctx.fillStyle = '#fff';
    ctx.fillText('C : ' + count, 5, 27);
};

var physics = new Physics(canvas.width, canvas.height, {
        gravitationalForces: false
    }),
    actors = [],
	frameId = null,
    collisionCount = 0,
    mouseCenter = Vector.NIL;

//actors[0] = physics.createBall(6371000, 2.97e26, canvas.width * 0.5, canvas.height * 0.5 - 6371000);
//actors[0].earth = true;

//var w = 560;
//actors[0] = physics.createBox(w, 10, 1, canvas.width * 0.5, canvas.height * 0.9, {immobile: true});
//actors[1] = physics.createBox(w, 10, 1, canvas.width * 0.5, canvas.height * 0.1, {immobile: true});
//actors[2] = physics.createBox(10, w, 1, canvas.width * 0.1, canvas.height * 0.5, {immobile: true});
//actors[3] = physics.createBox(10, w, 1, canvas.width * 0.9, canvas.height * 0.5, {immobile: true});

actors[0] = physics.createBox(
    Math.random() * 50 + 20, 
    Math.random() * 50 + 20, 
    1, 
    canvas.width * 0.5,
    canvas.height * 0.2
);
actors[0].rotate(new Angle(Math.PI * 2 * Math.random()));

actors[1] = physics.createBox(
    Math.random() * 50 + 20, 
    Math.random() * 50 + 20, 
    1, 
    canvas.width * 0.5,
    canvas.height * 0.8
);
actors[1].rotate(new Angle(Math.PI * 2 * Math.random()));

//var l = 2;
//for (var i = 0 ; i < l ; i++) {
//    for (var j = 0 ; j < l ; j++) {
//        actors[i * l + j + 4] = physics.createBox(
//            Math.random() * 30 + 20,
//            Math.random() * 30 + 20,
//            1,
//            canvas.width * 0.2 + (canvas.width * 0.8 - canvas.width * 0.2) * i / (l - 1),
//            canvas.height * 0.2 + (canvas.height * 0.8 - canvas.height * 0.2) * j / (l - 1)
//        );
//        actors[i * l + j + 4].rotate(new Angle(Math.PI * 2 * Math.random()));
//        actors[i * l + j + 4].velocity = new Vector(Math.random() * 200 - 100, Math.random() * 200 - 100);
//    }
//}

canvas.addEventListener('mousemove', function (e) {
    mouseCenter = new Vector(e.clientX, canvas.height - e.clientY);
});

canvas.addEventListener('mouseenter', function () {
    physics.start();
});

canvas.addEventListener('mouseleave', function () {
    physics.stop();
});

/* crappy. debug purpose only */
window.oncollision = function (coll) {
    if (coll.impact) {
        ctx.strokeStyle = '#f44646';
        ctx.beginPath();
        var iv = coll.normal.scale(20).add(coll.impact),
            tg = coll.normal.tangent().scale(20).add(coll.impact);

        ctx.moveTo(coll.impact.x, canvas.height - coll.impact.y);
        ctx.lineTo(iv.x, canvas.height - iv.y);

        ctx.moveTo(coll.impact.x, canvas.height - coll.impact.y);
        ctx.lineTo(tg.x, canvas.height - tg.y);

        ctx.closePath();
        ctx.stroke();
    }
    collisionCount++;
};

window.halt = function () {
    physics.stop();
    window.cancelAnimationFrame(frameId);
};

var paint = function () {
//    ctx.fillStyle = 'rgba(51, 51, 51, 1)';
//    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameId = window.requestAnimationFrame(paint);

//    physics.update();

    for (var i in actors) {
        printActor(actors[i]);
    }
    
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.5, 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    
    var middle = new Vector(canvas.width * 0.5, canvas.height * 0.5);
    
    printPolygon(Geometry.minkowskiDifference(actors[0].bounds(), actors[1].bounds()).getConvexHull().map(function (p) {
        return p.add(middle);
    }));

    physics.collisionDetector.flush();

    var col = physics.collisionDetector.get(actors[0], actors[1]);
    if (col) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.5, canvas.height * 0.5);
        var ds = col.normal.scale(20).add(middle);
        ctx.lineTo(ds.x, ds.y);
        ctx.closePath();
        ctx.stroke();
    }
    
    actors[1].center = mouseCenter;
    actors[1].computeAabb();
    
    printKineticEnergy(actors);
    printCollisionCount(collisionCount);
};
frameId = window.requestAnimationFrame(paint);