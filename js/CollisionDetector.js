var CollisionDetector = (function (_super) {
    "use strict";

    extend(CollisionDetector, _super);

    function CollisionDetector() {
        this.collisions = [];
    }

    /**
     *
     */
    CollisionDetector.prototype.flush = function () {
        this.collisions = [];
    };

    /**
     *
     * @param {PointActor} left
     * @param {PointActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.get = function (left, right) {
        var id = this.getCollisionId(left, right),
            collision = null;
        
        if (left.options.immobile && right.options.immobile) {
            return null;
        }

        if (this.collisions.indexOf(id) !== -1) {
            return null;
        }

        if (!left.aabb.intersect(right.aabb)) {
            return null;
        }
        
        switch (left.type + '-' + right.type) {
            case 'point-ball':
                collision = this.computePointBallCollision(left, right);
                break;

            case 'point-box':
                collision = this.computePointBoxCollision(left, right);
                break;

            case 'ball-ball':
                collision = this.computeBallBallCollision(left, right);
                break;

            case 'ball-box':
                collision = this.computeBallBoxCollision(left, right);
                break;
            case 'box-ball':
                collision = this.computeBallBoxCollision(right, left);
                break;

            case 'box-box':
                collision = this.computeBoxBoxCollision(left, right);
                break;

            default:
                collision = null;
                break;
        }

        if (collision) {
            this.collisions.push(id);
            collision.setId(id);
        }

        return collision;
    };

    /**
     *
     * @param {PointActor} left
     * @param {PointActor} right
     * @returns {String}
     */
    CollisionDetector.prototype.getCollisionId = function (left, right) {
        return left.id < right.id ? left.id + '|' + right.id : right.id + '|' + left.id;
    };

    /**
     *
     * @param {PointActor} left
     * @param {BallActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computePointBallCollision = function (left, right) {
        var distance = right.center.sub(left.center);

        if (distance.length() <= right.radius) {
            var penetration = right.radius - distance.length(),
                norm = distance.norm();

            return new Collision(
                left,
                right,
                norm.scale(-penetration / 2).add(left.center),
                norm,
                penetration
            );
        }
    },

    /**
     *
     * @param {PointActor} left
     * @param {BoxActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computePointBoxCollision = function (left, right) {
        //        var transposed = left.center.rotate(right.theta.inverse(), right.center).sub(right.center),
        //            closest = new Vector(
        //                Math.max(-right.dimension.x / 2, Math.min(right.dimension.x / 2, transposed.x)),
        //                Math.max(-right.dimension.y / 2, Math.min(right.dimension.y / 2, transposed.y))
        //            ),
        //            distance = transposed.sub(closest);
        //
        //        if (distance.length() <= 0) {
        //            var penetration = -distance.length(),
        //                norm = distance.norm();
        //            
        //            return new Collision(
        //                left,
        //                right,
        //                closest.sub(norm.scale(penetration / 2)).add(right.center).rotate(right.theta, right.center),
        //                norm.rotate(right.theta),
        //                penetration
        //            );
        //        }
        //
        //        return null;
    },

    /**
     *
     * @param {BallActor} left
     * @param {BallActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computeBallBallCollision = function (left, right) {
        var distance = right.center.sub(left.center);

        if (distance.length() <= left.radius + right.radius) {
            var penetration = left.radius + right.radius - distance.length(),
                norm = distance.norm();

            return new Collision(
                left,
                right,
                norm.scale(left.radius - penetration / 2).add(left.center),
                norm,
                penetration
            );
        }

        return null;
    };

    /**
     *
     * @params {BallActor} left
     * @params {BoxActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computeBallBoxCollision = function (left, right) {
        var transposed = left.center.rotate(right.theta.inverse(), right.center).sub(right.center),
            closest = new Vector(
                Math.max(-right.dimension.x / 2, Math.min(right.dimension.x / 2, transposed.x)),
                Math.max(-right.dimension.y / 2, Math.min(right.dimension.y / 2, transposed.y))
            ),
            distance = transposed.sub(closest);

        if (distance.length() <= left.radius) {
            var penetration = left.radius - distance.length(),
                norm = distance.norm();

            return new Collision(
                left,
                right,
                closest.sub(norm.scale(penetration / 2)).add(right.center).rotate(right.theta, right.center),
                norm.rotate(right.theta),
                penetration
            );
        }

        return null;
    };

    /**
     *
     * @param {BoxActor} left
     * @param {BoxActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computeBoxBoxCollision = function (left, right) {
        var minkdiff = Geometry.minkowskiDifference(left.bounds(), right.bounds()),
            hull = minkdiff.getConvexHull(),
            mtd = +Infinity, // Minimum Translational Distance
            //edge = [],
            current = null,
            supportingPoint = null;

        for (var i = 0 ; i < hull.length ; i++) {
            var current = Geometry.supportingPoint(Vector.NIL, hull[i], hull[(i + 1) % hull.length]);

            if (current.length() < mtd) {
                supportingPoint = current;
                //edge = [hull[i], hull[(i + 1) % hull.length]];
                mtd = current.length();
            }
        }

        if (mtd > 0) {
            return new Collision(
                left,
                right,
                null,
                supportingPoint.norm(),
                supportingPoint.length()
            );
        }

        return null;
    };

    return CollisionDetector;
})(Object);