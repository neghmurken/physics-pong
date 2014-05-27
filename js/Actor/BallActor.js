var BallActor = (function (_super) {
    "use strict";

    extend(BallActor, _super);

    function BallActor(x, y, r, m, options) {
        this.radius = r;
        
        BallActor.parent.constructor.call(this, x, y, m, options);
        
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
     */
    BallActor.prototype.computeAabb = function () {
        var radiusVector = new Vector(this.radius, this.radius),
            sw = this.center.sub(radiusVector),
            ne = this.center.add(radiusVector);

        if (this.aabb instanceof AABB) {
            this.aabb.update(sw, ne);
        } else {
            this.aabb = new AABB(sw, ne);
        }
    };
    
    return BallActor;
})(PointActor);