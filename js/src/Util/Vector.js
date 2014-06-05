var Vector = (function (_super) {
    "use strict";

    extend(Vector, _super);
    
    function Vector(x, y) {
        this.xy = new Float32Array(2);
        this._length = null;
        
        this.set(x, y);
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    Vector.create = function (x, y) {
        return new Vector(x || 0, y || 0);
    };
    
    /**
     *
     * @returns {String}
     */
    Vector.prototype.toString = function () {
        return '{' + this.xy[0] + ',' + this.xy[1] + '}';
    };
    
    /**
     * @param {Number} x
     * @param {Number} y
     */
    Vector.prototype.set = function (x, y) {
        this.xy[0] = x;
        this.xy[1] = y;
        
        this._length = null;
    };
    
    /**
     * @returns {Vector}
     */
    Vector.prototype.clone = function () {
        var clone = Vector.create(this.xy[0], this.xy[1]);
        clone._length = this._length;
        
        return clone;
    };

    /**
     *
     * @returns {Number}
     */
    Vector.prototype.length = function () {
        if (null === this._length) {
            this._length = Math.sqrt(this.xy[0] * this.xy[0] + this.xy[1] * this.xy[1]);
        }

        return this._length;
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.norm = function (out) {
        var length = this.length();
        
        if (length > 0) {
            this.scale(1 / length, out);
        } else {
            out.xy[0] = 0;
            out.xy[1] = 0;
        }
    };
    
    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.tangent = function (out) {
        out.xy[0] = -this.xy[1];
        out.xy[1] = this.xy[0];
    };
    
    /**
     *
     * @returns {Angle}
     */
    Vector.prototype.angle = function () {
        return new Angle(Math.atan2(this.xy[0], this.xy[1]));
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.inverse = function (out) {
        out.xy[0] = -this.xy[0];
        out.xy[1] = -this.xy[1];
    };

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    Vector.prototype.add = function (vector, out) {
        out.xy[0] = this.xy[0] + vector.xy[0];
        out.xy[1] = this.xy[1] + vector.xy[1];
    };

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    Vector.prototype.sub = function (vector, out) {
        out.xy[0] = this.xy[0] - vector.xy[0];
        out.xy[1] = this.xy[1] - vector.xy[1];
    };

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    Vector.prototype.mul = function (vector, out) {
        out.xy[0] = this.xy[0] * vector.xy[0];
        out.xy[1] = this.xy[1] * vector.xy[1];
    };

    /**
     *
     * @param {Number} factor Scale factor
     * @returns {Vector}
     */
    Vector.prototype.scale = function (factor, out) {
        out.xy[0] = this.xy[0] * factor;
        out.xy[1] = this.xy[1] * factor;
    };

    /**
     *
     * @param {Vector} vector
     * @returns {number}
     */
    Vector.prototype.dot = function (vector) {
        return this.xy[0] * vector.xy[0] + this.xy[1] * vector.xy[1];
    };

    /**
     *
     * @param {Angle} angle Angle in radians
     * @param {Vector} origin
     * @returns {Vector}
     */
    Vector.prototype.rotate = function (angle, origin, out) {
        if (typeof origin === 'undefined') {
            origin = Vector.create();
        }

        var x0 = this.xy[0] - origin.xy[0];
        var y0 = this.xy[1] - origin.xy[1];

        out.xy[0] = origin.xy[0] + ((x0 * Math.cos(angle.t)) - (y0 * Math.sin(angle.t)));
        out.xy[1] = origin.xy[1] + ((x0 * Math.sin(angle.t)) + (y0 * Math.cos(angle.t)));
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.mirrorX = function (out) {
        out.xy[0] = -this.xy[0];
        out.xy[1] = this.xy[1];
    };

    /**
     *
     * @returns {Vector}
     */
    Vector.prototype.mirrorY = function (out) {
        out.xy[0] = this.xy[0];
        out.xy[1] = -this.xy[1];
    };

    /**
     * TODO: inline
     * @param {Number} extension
     * @returns {Vector}
     */
    Vector.prototype.extend = function (extension, out) {
        this.norm(out);
        this.scale(this.length() + extension, out);
    };
    
    Vector.NIL = Vector.create(0, 0);
    
    return Vector;
})(Object);