var CollisionDetector = (function (_super) {
    "use strict";

    extend(CollisionDetector, _super);

    function CollisionDetector () {
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

        if (this.collisions.indexOf(id) === -1) {

            if (left.aabb.intersect(right.aabb)) {
                switch ([left.type, right.type].join('-')) {
                    case 'ball-ball':
                        collision = this.computeBallBallCollision(left, right);
                        break;

                    case 'ball-box':
                        collision = this.computeBallBoxCollision(left, right);
                        break;
                        
//                    case 'box-ball':
//                        collision = this.computeBallBoxCollision(right, left);
//                        break;

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
            }
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
        return [left.id, right.id].sort().join('|');
    };

    /**
     *
     * @param {BallActor} left
     * @param {BallActor} right
     * @returns {Collision}
     */
    CollisionDetector.prototype.computeBallBallCollision = function (left, right) {
        var distance = right.center.sub(left.center);

        if (distance.length() <= left.radius + right.radius) {
            var penetration = left.radius + right.radius - distance.length();

            return new Collision(
                left,
                right,
                distance.norm().scale(left.radius - penetration / 2).add(left.center),
                distance.norm(),
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
            var penetration = left.radius - distance.length();
            
            return new Collision(
                left,
                right,
                closest.sub(distance.norm().scale(penetration / 2)).add(right.center).rotate(right.theta, right.center),
                distance.norm().inverse().rotate(right.theta),
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
        var minkdiff = CollisionDetector.minkowskiDiff(left, right),
            hull = null,
            sorted = null,
            edge = null;

        // test if origin is in the shape
        if (minkdiff.contains(Vector.NIL)) {
            // compute the MTV (minimum translational vector) between the minkdiff and the origin
            hull = minkdiff.getConvexHull();
            sorted = hull.slice();
            
            sorted.sort(function (a, b) {
                return a.length() - b.length();
            });
            
            edge = sorted[0].sub(sorted[1]);
            
            return new Collision(
                left,
                right,
                null,
                edge.norm().tangent(),
                Math.abs(edge.norm().tangent().dot(sorted[0]))
            );
        }

        return null;
    };

    /**
     * @param {BoxActor} left
     * @param {BoxActor} right
     * @returns {ConvexPolygon}
     */
    CollisionDetector.minkowskiDiff = function (left, right) {
        if (!(left instanceof BoxActor) && !(right instanceof BoxActor)) {
            throw new TypeError('Parameters must be instances of BoxActor');
        }
        
        var minksum = new ConvexPolygon(),
            leftBounds = left.bounds(),
            rightBounds = right.bounds();

        for (var a in leftBounds) {
            for (var b in rightBounds) {
                minksum.addPoint(leftBounds[a].sub(rightBounds[b]));
            }
        }
        
        return minksum;
    };

    return CollisionDetector;
})(Object);