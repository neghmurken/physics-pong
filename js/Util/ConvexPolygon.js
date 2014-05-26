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
        var origin = null,
            points = this.points.slice(),
            point = null,
            stack = [];

        // get bottom-right point
        points.forEach(function (point) {
            if (!origin || origin.y > point.y || origin.y === point.y && origin.x <= point.x) {
                origin = point;
            }
        });

        points.splice(points.indexOf(origin), 1);

        // sort points
        points.sort(function (a, b) {
            return ConvexPolygon.orthoDistanceToLine(a, origin, b);
        });

        // apply algorithms with stack
        // we first init the stack with the first two points
        stack.push(origin);
        stack.push(points.shift());

        while (points.length !== 0) {
            point = points.shift();

            while (stack.length > 2) {
                if (ConvexPolygon.orthoDistanceToLine(point, stack[stack.length - 2], stack[stack.length - 1]) > 0) {
                    break;
                }

                stack.pop();
            }

            stack.push(point);
        }

        // return the stack
        return stack;
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

        for (var i = 0; i < hull.length; i++) {
            if (ConvexPolygon.orthoDistanceToLine(point, hull[i], hull[(i + 1) % hull.length]) < 0) {
                return false;
            }
        }

        return true;
    };

    /**
     * @param {Vector} point
     * @param {Vector} lineStart
     * @param {Vector} lineEnd
     * @returns {Boolean}
     */
    ConvexPolygon.orthoDistanceToLine = function (point, lineStart, lineEnd) {
        return (lineEnd.x - lineStart.x) * (point.y - lineStart.y) -
            (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
    };

    return ConvexPolygon;
})(Object);