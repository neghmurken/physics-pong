var CollisionDetector = (function (_super) {
    "use strict";

    extend(CollisionDetector, _super);

    function CollisionDetector () {
        this.collisions = [];
    }

    CollisionDetector.prototype.flush = function () {
        this.collisions = [];
    };

    CollisionDetector.prototype.get = function (left, right) {
        var collision = null;

        switch ([left.type, right.type].sort().join('-')) {
            case 'ball-ball':
                var distance = left.center.sub(right.center);

                if (distance.length() <= left.radius + right.radius) {
                    collision = new Collision(
                        left,
                        right,
                        distance.norm().scale(right.radius).add(right.center),
                        distance.norm(),
                        -(distance.length() - left.radius - right.radius)
                    );
                }

                break;

            default:
                break;
        }

        return collision;
    };

    return CollisionDetector;
})(Object);