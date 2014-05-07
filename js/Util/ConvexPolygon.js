var ConvexPolygon = (function (_super) {
    "use strict";

    extend(ConvexPolygon, _super);

    /**
     *
     * @param points
     * @constructor
     */
    function ConvexPolygon (points) {
        this.setPoints(typeof points !== 'undefined' ? points : []);
    }

    /**
     *
     * @param {Array} points
     */
    ConvexPolygon.prototype.setPoints = function (points) {
        var self = this;

        this.points = [];

        points.forEach(function (point) {
            self.addPoint(point);
        });
    };

    /**
     *
     * @param {Vector|Array} point
     */
    ConvexPolygon.prototype.addPoint = function (point) {
        this.points.push(point instanceof Vector ? point : new Vector(point[0], point[1]));
    };
    
    /**
     * @returns {Array}
     */
    ConvexPolygon.prototype.getConvexHull = function () {
        
    };

    /**
     * @return {Vector}
     */
    ConvexPolygon.prototype.center = function () {
        var x = 0, y = 0, length = this.points.length;

        this.points.forEach(function (point) {
            x += point.x;
            y += point.y;
        });

        return new Vector(x / length, y / length);
    };
    
    /**
     * @param {Vector} point
     * @returns {Boolean}
     */
    ConvexPolygon.prototype.contains = function (point) {
        var hull = this.getConvexHull();
        
        
    };

    return ConvexPolygon;
})(Object);