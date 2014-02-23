var BoxActor = (function (_super) {
    "use strict";
    
    extend(BoxActor, _super);

    function BoxActor(x, y, w, h, m) {
        BoxActor.parent.constructor.call(this, x, y, m);
        
        this.dimension = new Vector(w, h);
        this.type = 'box';
    }

    /**
     *
     * @param {Vector} factor
     */
    BoxActor.prototype.scale = function (factor) {
        this.dimension = this.dimension.mul(factor);
    };

    /**
     *
     * @returns {Array}
     */
    BoxActor.prototype.bounds = function () {
        var diag = this
            .dimension
            .scale(0.5);

        return [
            this.center.add(diag.inverse()).rotate(this.theta, this.center),
            this.center.add(diag.mirrorY()).rotate(this.theta, this.center),
            this.center.add(diag).rotate(this.theta, this.center),
            this.center.add(diag.mirrorX()).rotate(this.theta, this.center)
        ];
    };

    /**
     *
     * @returns {Array}
     */
    BoxActor.prototype.getAABB = function () {
        var xs = [], ys = [], bounds = this.bounds(), center;

        for (var i in bounds) {
            xs.push(bounds[i].x);
            ys.push(bounds[i].y);
        }

        return [
            center = new Vector(Math.min.apply(null, xs), Math.min.apply(null, ys)),
            (new Vector(Math.max.apply(null, xs), Math.max.apply(null, ys))).sub(center)
        ];
    };

    return BoxActor;
})(PointActor);