var Angle = (function (_super) {
    "use strict";

    extend(Angle, _super);

    function Angle(angle) {
        this.t = (angle + Math.PI * 2) % (Math.PI * 2);
    }

    Angle.EAST = new Angle(0);
    Angle.NORTHEAST = new Angle(Math.PI / 4);
    Angle.NORTH = new Angle(Math.PI / 2);
    Angle.NORTHWEST = new Angle(3 * Math.PI / 4);
    Angle.WEST = new Angle(Math.PI);
    Angle.SOUTHWEST = new Angle(5 * Math.PI / 4);
    Angle.SOUTH = new Angle(3 * Math.PI / 2);
    Angle.SOUTHEAST = new Angle(7 * Math.PI / 4);

    /**
     *
     * @returns {String}
     */
    Angle.prototype.toString = function () {
        return '(' + this.t + ')';
    };
    
    /**
     *
     * @param {Number} length
     * @returns {Vector}
     */
    Angle.prototype.toVector = function (length) {
        return (new Vector(length, 0)).rotate(this);
    };
    
    /**
     *
     * @param {Number}
     */
    Angle.prototype.toDegree = function () {
        return this.t * 180 / Math.PI;  
    };
    
    /**
     *
     * @param {Angle} angle
     * @returns {Angle}
     */
    Angle.prototype.add = function (angle) {
        return new Angle(this.t + angle.t);
    };

    /**
     *
     * @param {Angle} delta
     * @returns {Angle}
     */
    Angle.prototype.sub = function (delta) {
        return new Angle(this.add(-delta));
    };
    
    /**
     *
     * @returns {Angle}
     */
    Angle.prototype.inverse = function () {
        return new Angle(-this.t);
    };

    return Angle;
})(Object);