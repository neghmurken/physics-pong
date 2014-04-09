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
    function Collision(initiator, target, impact, normal, penetration) {
        this.id = null;
        this.initiator = initiator;
        this.target = target;
        this.impact = impact;
        this.normal = normal;
        this.penetration = penetration;
    }
    
    /**
     *
     * @param {String}
     */
    Collision.prototype.setId = function (id) {
        this.id = id;
    };

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
        return this.normal.inverse().scale(
            (this.penetration  + Collision.EPSILON) * (this.initiator.velocity.length() / this.getTotalVelocityLength())
        );
    }
    
    /**
     * @returns {Vector}
     */
    Collision.prototype.getTargetErrorCorrection = function () {
        return this.normal.scale(
            (this.penetration  + Collision.EPSILON) * (this.target.velocity.length() / this.getTotalVelocityLength())
        );
    }

    return Collision;
})(Object);