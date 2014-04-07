var Collision = (function (_super) {
    "use strict";

    extend(Collision, _super);
    
    Collision.EPSILON = 1;

    /**
     *
     * @param initiator
     * @param target
     * @param impact
     * @param normal
     * @param penetration
     * @constructor
     */
    function Collision(id, initiator, target, impact, normal, penetration) {
        this.id = id;
        this.initiator = initiator;
        this.target = target;
        this.impact = impact;
        this.normal = normal;
        this.penetration = penetration;
    }

    /**
     *
     * @returns {Vector}
     */
    Collision.prototype.tangent = function () {
        return new Vector(this.normal.y, -this.normal.x);
    };
    
    /**
     * @returns {Number}
     */
    Collision.prototype.getTotalVelocityLength = function () {
        return this.initiator.velocity.length() + this.target.velocity.length();
    };
    
    /**
     * @returns {Vector}
     */
    Collision.prototype.getInitiatorErrorCorrection = function () {
        return this.normal.scale(this.penetration * (this.initiator.velocity.length() / this.getTotalVelocityLength()) + Collision.EPSILON)
    }
    
    /**
     * @returns {Vector}
     */
    Collision.prototype.getTargetErrorCorrection = function () {
        return this.normal.scale(-this.penetration * (this.target.velocity.length() / this.getTotalVelocityLength()) + Collision.EPSILON)
    }

    return Collision;
})(Object);