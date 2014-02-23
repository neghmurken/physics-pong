var Vector = (function (_super) {
    "use strict";

    extend(Vector, _super);
    
    function Vector(x, y) {
        var precision = 10e5;
        this.x = Math.round(x * precision) / precision;
        this.y = Math.round(y * precision) / precision;
    }

    Vector.NIL = new Vector(0, 0);

    /**
     *
     * @returns {String}
     */
    Vector.prototype.toString = function () {
        return '{' + this.x + ',' + this.y + '}';
    };

    /**
     *
     * @returns {Number}
     */
    Vector.prototype.length = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.norm = function () {
        return this.scale(1 / this.length());
    };
    
    /**
     *
     * @returns {Angle}
     */
    Vector.prototype.angle = function () {
        return new Angle(Math.atan2(this.y, this.x));
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.inverse = function () {
        return new Vector(-this.x, -this.y);
    };

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    Vector.prototype.add = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    Vector.prototype.sub = function (vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    };

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    Vector.prototype.mul = function (vector) {
        return new Vector(this.x * vector.x, this.y * vector.y);
    };

    /**
     *
     * @param {Number} factor Scale factor
     * @returns {Vector}
     */
    Vector.prototype.scale = function (factor) {
        return new Vector(this.x * factor, this.y * factor);
    };

    /**
     *
     * @param {Vector} vector
     * @returns {number}
     */
    Vector.prototype.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y;
    };

    /**
     *
     * @param {Angle} angle Angle in radians
     * @param {Vector} origin
     * @returns {Vector}
     */
    Vector.prototype.rotate = function (angle, origin) {
        if (typeof origin === 'undefined') {
            origin = Vector.NIL;
        }

        var x0 = this.x - origin.x;
        var y0 = this.y - origin.y;

        return new Vector(
            origin.x + ((x0 * Math.cos(angle.t)) - (y0 * Math.sin(angle.t))),
            origin.y + ((x0 * Math.sin(angle.t)) + (y0 * Math.cos(angle.t)))
        );
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.mirrorX = function () {
        return new Vector(-this.x, this.y);
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.mirrorY = function () {
        return new Vector(this.x, -this.y);
    };
    
    return Vector;
})(Object);