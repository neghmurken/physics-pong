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
        var origin = null, 
            points = this.points.slice(),
            stack = [];

        // get bottom-right point
        points.forEach(function (point) {
            if (!origin || origin.y > point.y || origin.y === point.y && origin.x <= point.x) {
                origin = point;
            }
        });

        // sort points
        points.sort(function (left, right) {
            return ConvexPolygon.orthoDistanceToLine(left, origin, right);
        });

        // apply algorithms with stack
        // we first init the stack with the first two points
        stack.push(points.unshift());
        stack.push(points.unshift());
        
        while (points.length !== 0) {
            
        }

        // pop the stack
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