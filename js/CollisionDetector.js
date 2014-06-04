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
        var distance = Vector.create();

        right.center.sub(left.center, distance);

        if (distance.length() <= right.radius) {
            var penetration = right.radius - distance.length(),
                norm = Vector.create(),
                impact = Vector.create();

            distance.norm(norm);
            norm.scale(-penetration / 2, impact);
            impact.add(left.center, impact);

            return new Collision(left, right, impact, norm, penetration);
        }

        return null;
    };

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
    };

    /**
     *
     * @param {BallActor} left
     * @param {BallActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computeBallBallCollision = function (left, right) {
        var distance = Vector.create();
        right.center.sub(left.center, distance);

        if (distance.length() <= left.radius + right.radius) {
            var penetration = left.radius + right.radius - distance.length(),
                norm = Vector.create(),
                impact = Vector.create();

            distance.norm(norm);
            norm.scale(left.radius - penetration / 2, impact);
            impact.add(left.center, impact);

            return new Collision(left, right, impact, norm, penetration);
        }

        return null;
    };

    /**
     *
     * @param {BallActor} left
     * @param {BoxActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computeBallBoxCollision = function (left, right) {
        var transposed = Vector.create();
        left.center.rotate(right.theta.inverse(), right.center, transposed);
        transposed.sub(right.center, transposed);

        var closest = Vector.create(
            Math.max(-right.dimension.xy[0] / 2, Math.min(right.dimension.xy[0] / 2, transposed.xy[0])),
            Math.max(-right.dimension.xy[1] / 2, Math.min(right.dimension.xy[1] / 2, transposed.xy[1]))
        ),
            distance = Vector.create();

        transposed.sub(closest, distance);

        if (distance.length() <= left.radius) {
            var penetration = left.radius - distance.length(),
                norm = Vector.create(),
                impact = Vector.create();

            distance.norm(norm);

            norm.scale(penetration / 2, impact);
            closest.sub(impact, impact);
            impact.add(right.center, impact);
            impact.rotate(right.theta, right.center, impact);

            norm.rotate(right.theta, undefined, norm);

            return new Collision(left, right, impact, norm, penetration);
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
            current = null,
            supportingPoint = null;

        if (minkdiff.contains(Vector.NIL)) {
            for (var i = 0; i < hull.length; i++) {
                current = Geometry.supportingPoint(Vector.NIL, hull[i], hull[(i + 1) % hull.length]);

                if (current.length() < mtd) {
                    supportingPoint = current;
                    mtd = current.length();
                }
            }

            var norm = Vector.create();

            supportingPoint.norm(norm);

            return new Collision(
                left,
                right,
                supportingPoint,
                norm,
                supportingPoint.length()
            );
        }

        return null;
    };

    return CollisionDetector;
})(Object);