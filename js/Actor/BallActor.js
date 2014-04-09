var BallActor = (function (_super) {
    "use strict";

    extend(BallActor, _super);

    function BallActor(x, y, r, m) {
        BallActor.parent.constructor.call(this, x, y, m);
        
        this.radius = r;
        this.type = 'ball';
    }

    /**
     *
     * @param {Vector} factor
     */
    BallActor.prototype.scale = function (factor) {
        this.radius *= factor.length();
    };

    /**
     *
     * @returns {Array}
     */
    BallActor.prototype.aabb = function () {
        var radiusVector = new Vector(this.radius, this.radius);

        return new AABB(
            this.center.sub(radiusVector),
            this.center.add(radiusVector)
        );
    };
    
    return BallActor;
})(PointActor);