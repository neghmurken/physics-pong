var AABB = (function (_super) {
    "use strict";

    extend(AABB, _super);

    /**
     *
     * @param sw
     * @param ne
     * @constructor
     */
    function AABB(sw, ne) {
        this.sw = sw;
        this.ne = ne;
    }

    /**
     *
     * @param {AABB} other
     * @returns {Boolean}
     */
    AABB.prototype.intersect = function (other) {
        if (!(other instanceof AABB)) {
            throw new TypeError('Provided parameter must be an AABB object.');
        }

        return this.sw.x < other.ne.x &&
            this.ne.x > other.sw.x &&
            this.sw.y < other.ne.y &&
            this.ne.y > other.sw.y;
    };
    
    /**
     *
     * @returns {Array}
     */
    AABB.prototype.bounds = function () {
        return [
            this.sw,
            new Vector(this.ne.x, this.sw.x),
            this.ne,
            new Vector(this.sw.x, this.ne.x)
        ];
    };

    return AABB;
})(Object);