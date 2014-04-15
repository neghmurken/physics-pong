var BallActor = (function (_super) {
    "use strict";

    extend(BallActor, _super);

    function BallActor(x, y, r, m) {
        this.radius = r;
        
        BallActor.parent.constructor.call(this, x, y, m);
        
        this.type = 'ball';
    }

    /**
     *
     * @param {Vector} factor
     */
    BallActor.prototype.scale = function (factor) {
        this.radius *= factor.length();
        
        BallActor.parent.scale.call(this, factor);
    };

    /**
     *
     * @returns {AABB}
     */
    BallActor.prototype.computeAabb = function () {
        var radiusVector = new Vector(this.radius, this.radius);
        
        this.aabb = new AABB(
            this.center.sub(radiusVector),
            this.center.add(radiusVector)
        );
    };
    
    return BallActor;
})(PointActor);