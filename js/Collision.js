var Collision = (function (_super) {
    "use strict";

    extend(Collision, _super);

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

    return Collision;
})(Object);