var Geometry = (function () {
    "use strict";

    return {
        minkowskiDifference: function (leftSet, rightSet) {
            var minksum = new ConvexPolygon();

            for (var a in leftSet) {
                for (var b in rightSet) {
                    minksum.addPoint(leftSet[a].sub(rightSet[b]));
                }
            }

            return minksum;
        },

        /**
         * @param {Array} points
         * @returns {Array}
         */
        convexHull: function (points) {
            var origin = null,
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
                return Geometry.distanceToLine(a, origin, b);
            });

            // apply algorithms with stack
            // we first init the stack with the first two points
            stack.push(origin);
            stack.push(points.shift());

            while (points.length !== 0) {
                point = points.shift();

                while (stack.length > 2) {
                    if (Geometry.distanceToLine(point, stack[stack.length - 2], stack[stack.length - 1]) > 0) {
                        break;
                    }

                    stack.pop();
                }

                stack.push(point);
            }

            // return the stack
            return stack;
        },

        /**
         *
         * @param {Vector} point
         * @param {Vector} lineStart
         * @param {Vector} lineEnd
         * @returns {Number}
         */
        distanceToLine: function (point, lineStart, lineEnd) {
            return (lineEnd.x - lineStart.x) * (point.y - lineStart.y) - (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
        },

        /**
         * @param {Vector} Point
         * @param {Vector} lineStart
         * @param {Vector} lineEnd
         */
        supportingPoint: function (point, lineStart, lineEnd) {
            var segment = lineEnd.sub(lineStart);

            return lineStart.add(segment.norm().scale(
                Math.max(0, Math.min(segment.length(), segment.norm().dot(point.sub(lineStart))))
            ));
        }
    };
})();