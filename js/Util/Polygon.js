var Polygon = (function (_super) {
    "use strict";

    extend(Polygon, _super);

    /**
     *
     * @param points
     * @constructor
     */
    function Polygon (points) {
        this.setPoints(typeof points !== 'undefined' ? points : []);
    }

    /**
     *
     * @param {Array} points
     */
    Polygon.prototype.setPoints = function (points) {
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
    Polygon.prototype.addPoint = function (point) {
        this.points.push(point instanceof Vector ? point : new Vector(point[0], point[1]));
    };

    /**
     * @return {Vector}
     */
    Polygon.prototype.center = function () {
        var x = 0, y = 0, length = this.points.length;

        this.points.forEach(function (point) {
            x += point.x;
            y += point.y;
        });

        return new Vector(x / length, y / length);
    };

    return Polygon;
})(Object);