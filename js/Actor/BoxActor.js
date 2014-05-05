var BoxActor = (function (_super) {
    "use strict";
    
    extend(BoxActor, _super);

    function BoxActor(x, y, w, h, m) {
        this.dimension = new Vector(w, h);
        
        BoxActor.parent.constructor.call(this, x, y, m);

        this.type = 'box';
    }

    /**
     *
     * @param {Vector} factor
     */
    BoxActor.prototype.scale = function (factor) {
        this.dimension = this.dimension.mul(factor);
        
        BoxActor.parent.scale.call(this, factor);
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
     */
    BoxActor.prototype.computeAabb = function() {
        var xs = [], ys = [], bounds = this.bounds(), sw, ne;

        for (var i in bounds) {
            xs.push(bounds[i].x);
            ys.push(bounds[i].y);
        }
        
        sw = new Vector(Math.min.apply(null, xs), Math.min.apply(null, ys));
        ne = new Vector(Math.max.apply(null, xs), Math.max.apply(null, ys));

        if (this.aabb instanceof AABB) {
            this.aabb.update(sw, ne);
        } else {
            this.aabb = new AABB(sw, ne);
        }
    };

    return BoxActor;
})(PointActor);