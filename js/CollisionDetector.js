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
        switch ([left.type, right.type].sort().join('-')) {
            case 'ball-ball':
                return this.computeBallBallCollision(left, right);

            default:
                return null;
        }
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
            var penetration = -(distance.length() - left.radius - right.radius);

            return new Collision(
                left,
                right,
                distance.norm().scale(right.radius - penetration / 2).add(right.center),
                distance.norm(),
                penetration
            );
        }

        return null;
    };

    return CollisionDetector;
})(Object);