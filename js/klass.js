var extend = function(child, parent) { 
    for (var key in parent) { 
        if (parent.hasOwnProperty(key)) {
            child[key] = parent[key]; 
        }
    };

    function ctor() {
        this.constructor = child; 
    };

    ctor.prototype = parent.prototype; 

    child.prototype = new ctor(); 
    child.parent = parent.prototype; 

    return child;
};

var merge = function () {
    var output = {};
    
    for (var i = 0 ; i < arguments.length ; i++) {
        for (name in arguments[i]) {
            if (arguments[i].hasOwnProperty(name)) {
                output[name] = arguments[i][name];
            }
        }
    }
    
    return output;
}