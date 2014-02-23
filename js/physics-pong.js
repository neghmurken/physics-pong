var canvas = document.createElement('canvas');
canvas.id = 'pp';
canvas.width = window.innerWidth - document.body.style.marginLeft - document.body.style.marginRight;
canvas.height = window.innerHeight - document.body.style.marginTop - document.body.style.marginBottom;

var info = document.getElementById('info');

document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 2;
ctx.lineJoin = 'bevel';

function printActor(actor) {
    switch(actor.type) {
        case 'box':
            var bounds = actor.bounds();

            ctx.beginPath();
            ctx.moveTo(bounds[0].x, bounds[0].y);
            ctx.lineTo(bounds[1].x, bounds[1].y);
            ctx.lineTo(bounds[2].x, bounds[2].y);
            ctx.lineTo(bounds[3].x, bounds[3].y);
            ctx.lineTo(bounds[0].x, bounds[0].y);
            ctx.closePath();

            ctx.stroke();
            break;
            
        case 'ball':
            ctx.beginPath();
            ctx.arc(actor.center.x, actor.center.y, actor.radius, 0, 2 * Math.PI, false);
            ctx.closePath();

            ctx.fill();
            break;
    }
}

var physics = new Physics(canvas.width, canvas.height),
    balls = [],
    mouseCenter = Vector.NIL;

for (var i = 0 ; i < 10; i++) {
    balls[i] = physics.createBall(Math.random() * 5 + 10, 100000000, canvas.width * Math.random(), canvas.height * Math.random());
}

//ball1.velocity = ball2.center.sub(ball1.center).norm().scale(100);
//ball2.velocity = ball1.center.sub(ball2.center).norm().scale(100);

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



