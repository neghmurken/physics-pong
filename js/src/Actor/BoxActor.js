var BoxActor = (function (_super) {
    "use strict";
    
    extend(BoxActor, _super);

    function BoxActor(x, y, w, h, m, options) {
        this.dimension = Vector.create(w, h);
        
        this.diag = Vector.create();
        this.dimension.scale(0.5, this.diag);
        
        this._bounds = [
            Vector.create(),
            Vector.create(),
            Vector.create(),
            Vector.create()
        ];
        
        BoxActor.parent.constructor.call(this, x, y, m, options);
        
        this.inertia = m / 12 * (w * w + h * h);
        
        this.type = 'box';
    }

    /**
     *
     * @param {Vector} factor
     */
    BoxActor.prototype.scale = function (factor) {
        this.dimension.mul(factor, this.dimension);
        
        BoxActor.parent.scale.call(this, factor);
    };

    /**
     *
     * @returns {Array}
     */
    BoxActor.prototype.bounds = function () {
        var diag = Vector.create();
        
        this.diag.inverse(diag);
        this.center.add(diag, this._bounds[0]);
        
        this.diag.mirrorX(diag);
        this.center.add(diag, this._bounds[1]);
        
        this.center.add(this.diag, this._bounds[2]);
        
        this.diag.mirrorY(diag);
        this.center.add(diag, this._bounds[3]);
        
        for (var i in this._bounds) {
            this._bounds[i].rotate(this.theta, this.center, this._bounds[i]);
        }

        return this._bounds;
    };

    /**
     *
     */
    BoxActor.prototype.computeAabb = function() {
        var xs = [], ys = [], bounds = this.bounds();

        for (var i in bounds) {
            xs.push(bounds[i].xy[0]);
            ys.push(bounds[i].xy[1]);
        }

        if (!(this.aabb instanceof AABB)) {
            this.aabb = new AABB(
                Vector.create(),
                Vector.create()
            );
        }

        this.aabb.sw.set(Math.min.apply(null, xs), Math.min.apply(null, ys));
        this.aabb.ne.set(Math.max.apply(null, xs), Math.max.apply(null, ys));
    };

    return BoxActor;
})(PointActor);