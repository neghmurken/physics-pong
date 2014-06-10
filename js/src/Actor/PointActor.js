var PointActor = (function (_super) {
    "use strict";
    
    extend(PointActor, _super);
    
    function PointActor(x, y, m, options) {
        this.center = Vector.create(x, y);
        this.velocity = Vector.create();
        this.aabb = null;

        this.theta = Angle.EAST;
        this.omega = Angle.EAST;

        if (typeof m === 'undefined') {
            m = 1;
        }

        this.mass = m;
        this.inertia = 0;
        
        this.type = 'point';
        this.id = ++PointActor.count;

        this.options = merge({
            immobile: false,
            ghost: false,
            elasticity: 1,
            friction: 0
        }, options || {});
        
        this.computeAabb();
    }

    PointActor.count = 0;
    
    /**
     *
     * @returns {Vector}
     */
    PointActor.prototype.getMomentum = function () {
        var momentum = Vector.create();
        this.velocity.scale(this.mass, momentum);

        return momentum;
    };
    
    /**
     *
     * @returns {Number}
     */
    PointActor.prototype.getKineticEnergy = function () {
        return 0.5 * this.mass * Math.pow(this.velocity.length(), 2);
    };

    /**
     *
     * @param {Angle} angle
     * @param {Vector} origin
     */
    PointActor.prototype.rotate = function (angle, origin) {
        if (typeof origin !== 'undefined') {
            this.center.rotate(angle, origin, this.center);
        }

        this.theta = this.theta.add(angle);
        
        this.computeAabb();
    };

    /**
     *
     * @param {Vector} translation
     */
    PointActor.prototype.translate = function (translation) {
        this.center.add(translation, this.center);
        
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
     */
    PointActor.prototype.computeAabb = function () {
        if (!(this.aabb instanceof AABB)) {
            this.aabb = new AABB(
                Vector.create(), 
                Vector.create()
            );
        }
        
        this.aabb.sw.set(this.center);
        this.aabb.ne.set(this.center);
    };
    
    return PointActor;
})(Object);