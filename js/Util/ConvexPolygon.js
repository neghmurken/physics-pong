var ConvexPolygon = (function (_super) {
    "use strict";

    extend(ConvexPolygon, _super);

    /**
     *
     * @param points
     * @constructor
     */
    function ConvexPolygon(points) {
        this.setPoints(typeof points !== 'undefined' ? points : []);
    }

    /**
     *
     * @param {Array} points
     */
    ConvexPolygon.prototype.setPoints = function (points) {
        var self = this;

        this.points = [];
        this._hull = null;

        points.forEach(function (point) {
            self.addPoint(point);
        });
    };

    /**
     *
     * @param {Vector|Array} point
     */
    ConvexPolygon.prototype.addPoint = function (point) {
        this.points.push(point instanceof Vector ? point : Vector.create(point[0], point[1]));
    };
    
    /**
     * @returns {Array
     */
    ConvexPolygon.prototype.getConvexHull = function () {
        if (this._hull === null) {
            this._hull = Geometry.convexHull(this.points.slice());
        }
        
        return this._hull.slice();
    };

    /**
     * @return {Vector}
     */
    ConvexPolygon.prototype.center = function () {
        var hull = this.getConvexHull(),
            x = 0,
            y = 0,
            length = hull.length;

        hull.forEach(function (point) {
            x += point.xy[0];
            y += point.xy[1];
        });

        return new Vector(x / length, y / length);
    };

    /**
     * @param {Vector} point
     * @returns {Boolean}
     */
    ConvexPolygon.prototype.contains = function (point) {
        var hull = this.getConvexHull();

        for (var i = 0; i < hull.length; i++) {
            if (Geometry.distanceToLine(point, hull[i], hull[(i + 1) % hull.length]) < 0) {
                return false;
            }
        }

        return true;
    };

    return ConvexPolygon;
})(Object);