var Physics = (function (_super) {
    "use strict";

    extend(Physics, _super);

    /**
     * @param {Number} width
     * @param {Number} height
     * @constructor
     */
    function Physics(width, height, options) {
        this.width = width;
        this.height = height;
        
        this.actors = [];
        this.running = false;
        this.timestamp = null;
        this.timeFactor = 1;
        
        this.options = merge({
            gravitationalForces: false
        }, options || {});
        
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
     * @param {Number} factor
     */
    Physics.prototype.setTimeFactor = function (factor) {
        this.timeFactor = factor;
    };

    /**
     *
     */
    Physics.prototype.update = function () {
        if (!this.running) {
            return;
        }

        this.collisionDetector.flush();
        var dt = this.getElapsedSeconds(), 
            length = this.actors.length,
            i,
            j;

        for (i = 0 ; i < length ; i++) {
            this.updateActor(this.actors[i], dt);
            
            for (j = i + 1 ; j < length ; j++) {
                this.checkForCollision(this.actors[i], this.actors[j]);
            }
        }
    };

    /**
     *
     * @param {PointActor} actor
     * @returns {Array}
     */
    Physics.prototype.gatherForces = function (actor) {
        var resultant = Vector.NIL, distance;

        // gravitational forces

        if (this.options.gravitationalForces) {
            for (var i in this.actors) {
                if (this.actors[i] !== actor) {
                    distance = this.actors[i].center.sub(actor.center);
                    
                    resultant = resultant.add(distance.norm().scale(Physics.G * (actor.mass * this.actors[i].mass) / Math.pow(distance.length(), 2)));
                }
            }
        }

        return resultant;
    };

    /**
     *
     * @param {PointActor} actor
     * @param {Number} dt Elapsed seconds since previous update
     */
    Physics.prototype.updateActor = function (actor, dt) {
        if (!actor.options.immobile) {
            var prevVel = actor.velocity;

            actor.velocity = actor.velocity.add(this.gatherForces(actor).scale(1 / actor.mass).scale(dt));
            actor.translate(actor.velocity.add(prevVel).scale(1 / 2).scale(dt));
        } else {
            actor.velocity = Vector.NIL;
        }
    };

    /**
     * @returns {Number}
     */
    Physics.prototype.getElapsedSeconds = function () {
        var old = this.timestamp;
        this.timestamp = new Date();

        return (this.timestamp - old) / 1000 * this.timeFactor;
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

        var tg = collision.normal.tangent(),
            cn = collision.normal,
            // mass of left actor
            m1 = left.options.immobile ? 1e99 : left.mass,
            // mass of right actor
            m2 = right.options.immobile ? 1e99 : right.mass,
            // total mass of the system
            masses = m1 + m2,
            // normal coefficient of restitution depending on both actors elasticity
            ncr = Math.min(left.options.elasticity, right.options.elasticity),
            // tangential coefficient of restitution depending on both actors friction
            tcr = 1 - Math.max(left.options.friction, right.options.friction),
            // normal velocity of left actor
            v1 = left.velocity.dot(cn),
            // normal velocity of right actor
            v2 = right.velocity.dot(cn);
    
        // error correction
        // TODO: translate objects along the velocity normal not the collision normal

        if (!left.options.immobile) {
            left.translate(collision.getInitiatorErrorCorrection());
            left.velocity = tg
                .scale(left.velocity.dot(tg) * tcr)
                .add(cn.scale((ncr * v1 * (m1 - m2) + 2 * m2 * v2) / masses));
        }

        if (!right.options.immobile) {
            right.translate(collision.getTargetErrorCorrection());
            right.velocity = tg
                .scale(right.velocity.dot(tg) * tcr)
                .add(cn.scale((ncr * v2 * (m2 - m1) + 2 * m1 * v1) / masses));
        }

        window.oncollision(collision);
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
     * @param {Object} options
     */
    Physics.prototype.createPoint = function (m, x, y, options) {
        var point = new PointActor(
            typeof x !== 'undefined' ? x : 0,
            typeof y !== 'undefined' ? y : 0,
            m,
            options
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
     * @param {Object} options 
     */
    Physics.prototype.createBox = function (w, h, m, x, y, options) {
        var box = new BoxActor(
            typeof x !== 'undefined' ? x : 0,
            typeof y !== 'undefined' ? y : 0,
            w,
            h,
            m,
            options
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
     * @param {Object} options
     */
    Physics.prototype.createBall = function (r, m, x, y, options) {
        var ball = new BallActor(
            typeof x !== 'undefined' ? x : 0,
            typeof y !== 'undefined' ? y : 0,
            r,
            m,
            options
        );

        this.registerActor(ball);

        return ball;
    };

    return Physics;
})(Object);