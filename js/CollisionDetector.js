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
        if (this.collisions.indexOf(this.getCollisionId(left, right)) !== -1) {
            return null;
        }
        
        switch ([left.type, right.type].join('-')) {
            case 'ball-ball':
                return this.computeBallBallCollision(left, right);

            case 'ball-box':
                return this.computeBallBoxCollision(left, right);
            case 'box-ball':
                return this.computeBallBoxCollision(right, left);

            case 'box-box':
                return this.computeBoxBoxCollision(left, right);

            default:
                return null;
        }
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
        var distance = left.center.sub(right.center);

        if (distance.length() <= left.radius + right.radius) {
            var penetration = left.radius + right.radius - distance.length(),
                id = this.getCollisionId(left, right);

            this.collisions.push(id);

            return new Collision(
                id,
                left,
                right,
                distance.norm().scale(right.radius - penetration / 2).add(right.center),
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
            var penetration = left.radius - distance.length(),
                id = this.getCollisionId(left, right);
            
            this.collisions.push(id);

            return new Collision(
                id,
                left,
                right,
                closest.sub(distance.norm().scale(penetration / 2)).add(right.center).rotate(right.theta),
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
        var minksum = [],
            leftBounds = left.bounds(),
            rightBounds = right.bounds();

        for (var a in leftBounds) {
            for (var b in rightBounds) {
                minksum.push(leftBounds[a].sub(rightBounds[b]));
            }
        }

        return null;
    };

    return CollisionDetector;
})(Object);