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