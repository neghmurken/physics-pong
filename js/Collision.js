var Collision = (function (_super) {
    "use strict";

    extend(Collision, _super);

    Collision.EPSILON = 0.02;

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

        this.initiatorFactor = Math.max(1, this.initiator.velocity.length() / this.initiator.mass);
        this.targetFactor = Math.max(1, this.target.velocity.length() / this.target.mass);
    }

    /**
     *
     * @param {String}
     */
    Collision.prototype.setId = function (id) {
        this.id = id;
    };

    /**
     * @returns {Number}
     */
    Collision.prototype.getInitiatorWeight = function () {
        return this.initiatorFactor / (this.initiatorFactor + this.targetFactor);
    };

    /**
     * @returns {Number}
     */
    Collision.prototype.getTargetWeight = function () {
        return this.targetFactor / (this.initiatorFactor + this.targetFactor);
    };

    /**
     * @returns {Vector}
     */
    Collision.prototype.getInitiatorErrorCorrection = function () {
        var errorCorrection = Vector.create();
        
        this.normal.inverse(errorCorrection);
        errorCorrection.scale(this.penetration * this.getInitiatorWeight() + Collision.EPSILON, errorCorrection);
        
        return errorCorrection;
    };

    /**
     * @returns {Vector}
     */
    Collision.prototype.getTargetErrorCorrection = function () {
        var errorCorrection = Vector.create();
        
        this.normal.scale(this.penetration * this.getTargetWeight() + Collision.EPSILON, errorCorrection);
        
        return errorCorrection;
    };

    return Collision;
})(Object);