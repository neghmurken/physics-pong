var PointActor = (function (_super) {
    "use strict";
    
    extend(PointActor, _super);
    
    function PointActor(x, y, m) {
        this.center = new Vector(x, y);
        this.velocity = Vector.NIL;

        this.theta = Angle.EAST;

        if (typeof m === 'undefined') {
            m = 1;
        }

        this.mass = m;
        this.type = 'point';
        this.id = ++PointActor.count;
        
        this.computeAabb();
    }

    PointActor.count = 0;
    
    /**
     *
     * @returns {Vector}
     */
    PointActor.prototype.getMomentum = function () {
        return this.velocity.scale(this.mass);
    };
    
    /**
     *
     * @returns {Number}
     */
    PointActor.prototype.getKineticEnergy = function () {
        return 0.5 * this.mass * Math.pow(this.velocity.length(), 2);
    }

    /**
     *
     * @param {Angle} angle
     * @param {Vector} origin
     */
    PointActor.prototype.rotate = function (angle, origin) {
        if (typeof origin !== 'undefined') {
            this.center = this.center.rotate(angle, origin);
        }

        this.theta = this.theta.add(angle);
        
        this.computeAabb();
    };

    /**
     *
     * @param {Vector} translation
     */
    PointActor.prototype.translate = function (translation) {
        this.center = this.center.add(translation);
        
        this.computeAabb();
    };

    /**
     *
     * @param {Vector} factor
     */
    PointActor.prototype.scale = function (factor) {
    };

    /**
     *
     * @returns {AABB}
     */
    PointActor.prototype.computeAabb = function () {
        this.aabb = new AABB(this.center, this.center);
    };
    
    return PointActor;
})(Object);