var BallActor = (function (_super) {
    "use strict";

    extend(BallActor, _super);

    function BallActor(x, y, r, m, options) {
        this.radius = r;
        this.radiusVector = Vector.create(r, r);

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
        if (!(this.aabb instanceof AABB)) {
            this.aabb = new AABB(
                Vector.create(),
                Vector.create()
            );
        }

        this.center.sub(this.radiusVector, this.aabb.sw);
        this.center.add(this.radiusVector, this.aabb.ne);
    };

    return BallActor;
})(PointActor);