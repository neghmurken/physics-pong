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
        
        this.initiatorFactor = this.initiator.velocity.length() / this.initiator.mass;
        this.targetFactor = this.target.velocity.length() / this.target.mass;
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
        return this.normal.inverse().scale(
            this.penetration * this.getInitiatorWeight() + Collision.EPSILON
        );
    };

    /**
     * @returns {Vector}
     */
    Collision.prototype.getTargetErrorCorrection = function () {
        return this.normal.scale(
            this.penetration * this.getTargetWeight() + Collision.EPSILON
        );
    };

    return Collision;
})(Object);