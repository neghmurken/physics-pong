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
        this.update(sw, ne);
    }
    
    /**
     * @param {Vector} sw
     * @param {Vector} ne
     */
    AABB.prototype.update = function (sw, ne) {
        this.sw = sw;
        this.ne = ne;
    };

    /**
     *
     * @param {AABB} other
     * @returns {Boolean}
     */
    AABB.prototype.intersect = function (other) {
        if (!(other instanceof AABB)) {
            throw new TypeError('Provided parameter must be an AABB object.');
        }

        return this.sw.xy[0] < other.ne.xy[0] &&
            this.ne.xy[0] > other.sw.xy[0] &&
            this.sw.xy[1] < other.ne.xy[1] &&
            this.ne.xy[1] > other.sw.xy[1];
    };
    
    /**
     *
     * @returns {Array}
     */
    AABB.prototype.bounds = function () {
        return [
            this.sw,
            Vector.create(this.sw.xy[0], this.ne.xy[1]),
            this.ne,
            Vector.create(this.ne.xy[0], this.sw.xy[1])
        ];
    };

    return AABB;
})(Object);