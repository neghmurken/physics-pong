var Geometry = (function () {
    "use strict";

    return {
        minkowskiDifference: function (leftSet, rightSet) {
            var minksum = new ConvexPolygon();

            for (var a in leftSet) {
                for (var b in rightSet) {
                    minksum.addPoint([
                        leftSet[a].xy[0] - rightSet[b].xy[0],
                        leftSet[a].xy[1] - rightSet[b].xy[1]
                    ]);
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
                if (!origin || origin.xy[1] > point.xy[1] || origin.xy[1] === point.xy[1] && origin.xy[0] <= point.xy[0]) {
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
            return (lineEnd.xy[0] - lineStart.xy[0]) * (point.xy[1] - lineStart.xy[1])
                - (lineEnd.xy[1] - lineStart.xy[1]) * (point.xy[0] - lineStart.xy[0]);
        },

        /**
         * @param {Vector} Point
         * @param {Vector} lineStart
         * @param {Vector} lineEnd
         */
        supportingPoint: function (point, lineStart, lineEnd) {
            var segment = Vector.create(),
                segmentLength = 0,
                output = Vector.create();
            
            lineEnd.sub(lineStart, segment);
            
            segmentLength = segment.length();
            segment.norm(segment);
            
            point.sub(lineStart, output);
            
            segment.scale(
                Math.max(0, Math.min(segmentLength, segment.dot(output))),
                output
            );
            
            output.add(lineStart, output);
            
            return output;
        }
    };
})();