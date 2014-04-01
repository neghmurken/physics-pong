var Physics = (function (_super) {
    "use strict";

    extend(Physics, _super);

    function Physics(width, height) {
        this.width = width;
        this.height = height;
        this.actors = [];
        this.running = false;
        this.timestamp = null;
        this.collisionDetector = new CollisionDetector();
    }

    Physics.G = 6.673e-11;

    /**
     *
     */
    Physics.prototype.start = function () {
        this.running = true;
        this.timestamp = new Date();
    };

    /**
     *
     */
    Physics.prototype.stop = function () {
        this.running = false;
        this.timestamp = null;
    };

    /**
     *
     */
    Physics.prototype.update = function () {
        if (!this.running) {
            return;
        }

        this.collisionDetector.flush();
        var dt = this.getElapsedSeconds(), i, j;

        for (i in this.actors) {
            this.updateActor(this.actors[i], dt);
        }
        
        for (i in this.actors) {
            for (j in this.actors) {
                if (this.actors[i] !== this.actors[j]) {
                    this.checkForCollision(this.actors[i], this.actors[j]);
                }
            }
        }
    };

    /**
     *
     * @param {PointActor} actor
     * @returns {Array}
     */
    Physics.prototype.gatherForces = function (actor) {
        var forces = [], forceAngle, distance;

        // gravitational forces
        for (var i in this.actors) {
            if (this.actors[i] !== actor) {
                distance = this.actors[i].center.sub(actor.center);

                forceAngle = distance.angle();

                forces.push(forceAngle.toVector(Physics.G * (actor.mass * this.actors[i].mass) / Math.pow(distance.length(), 2)));
            }
        }

        return forces;
    };

    /**
     *
     * @param {PointActor} actor
     * @param {Number} dt Elapsed seconds since previous update
     */
    Physics.prototype.updateActor = function (actor, dt) {
        var forces = this.gatherForces(actor),
            prevVel = actor.velocity,
            resultant = new Vector(0, 0),
            i;

        for (i in forces) {
            resultant = resultant.add(forces[i]);
        }

        actor.velocity = actor.velocity.add(resultant.scale(1 / actor.mass).scale(dt));
        actor.translate(actor.velocity.add(prevVel).scale(1 / 2).scale(dt));
    };

    /**
     * @returns {Number}
     */
    Physics.prototype.getElapsedSeconds = function () {
        var old = this.timestamp;
        this.timestamp = new Date();

        return (this.timestamp - old) / 1000;
    };

    /**
     *
     * @param {PointActor} left
     * @param {PointActor} right
     */
    Physics.prototype.checkForCollision = function (left, right) {
        var collision = this.collisionDetector.get(left, right);

        if (null === collision) {
            return;
        }

        var tg = collision.tangent(),
            cn = collision.normal,
            masses = left.mass + right.mass,
            cr = 1,// TODO : compute from objects elasticity
            v1 = cn.scale(left.velocity.dot(cn)).length(),
            v2 = cn.scale(right.velocity.dot(cn)).length(),
            epsilon = 1;

        // error correction
        left.translate(cn.scale(collision.penetration * left.mass / masses).extend(epsilon));
        right.translate(cn.scale(collision.penetration * right.mass / masses).extend(epsilon).inverse());
        
        left.velocity = tg
            .scale(left.velocity.dot(tg))
            .add(cn.scale((cr * right.mass * (v2 - v1) + left.mass * v1 + right.mass * v2) / masses));

        right.velocity = tg
            .scale(right.velocity.dot(tg))
            .add(cn.inverse().scale((cr * left.mass * (v1 - v2) + right.mass * v2 + left.mass * v1) / masses));
    };

    /**
     *
     * @param {PointActor} actor
     */
    Physics.prototype.registerActor = function (actor) {
        if (!(actor instanceof PointActor)) {
            throw new TypeError('Provided object must be an actor');
        }

        this.actors.push(actor);
    };

    /**
     *
     * @param {Number} m Mass
     * @param {Number} x Coordinate x (optional)
     * @param {Number} y Coordinate y (optional)
     */
    Physics.prototype.createPoint = function (m, x, y) {
        var point = new PointActor(
            typeof x !== 'undefined' ? x : 0,
            typeof y !== 'undefined' ? y : 0,
            m
        );

        this.registerActor(point);

        return point;
    };

    /**
     *
     * @param {Number} w Width
     * @param {Number} h Height
     * @param {Number} m Mass
     * @param {Number} x Coordinate x (optional)
     * @param {Number} y Coordinate y (optional)
     */
    Physics.prototype.createBox = function (w, h, m, x, y) {
        var box = new BoxActor(
            typeof x !== 'undefined' ? x : 0,
            typeof y !== 'undefined' ? y : 0,
            w,
            h,
            m
        );

        this.registerActor(box);

        return box;
    };

    /**
     *
     * @param {Number} r Radius
     * @param {Number} m Mass
     * @param {Number} x Coordinate x (optional)
     * @param {Number} y Coordinate y (optional)
     */
    Physics.prototype.createBall = function (r, m, x, y) {
        var ball = new BallActor(
            typeof x !== 'undefined' ? x : 0,
            typeof y !== 'undefined' ? y : 0,
            r,
            m
        );

        this.registerActor(ball);

        return ball;
    };

    return Physics;
})(Object);