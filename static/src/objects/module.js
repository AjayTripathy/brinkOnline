define(function() {
    function Module (options) {
        if (!(this instanceof Module)) return new Module();
    	
        options = util.extend({ 
            name: null,
            minPower: 0,
            maxPower: 0,
            type: null,
            weight: 100,
            parent: null,
            children: [],
        }, options);
        util.extend(this, options);

        this.id = this.name + util.guid();
        this.ship = null;
    }


    /**
     *called when the module takes damage
     *@param damageObj : a damage object 
    */

    Module.prototype._takeDamage = function (damageObj) {
        
    }

    Module.prototype.add = function(hardPoint, ship){
        if ( hardPoint.validateModule() ){
            hardPoint.addModule(this);
            this.parent = hardPoint;
            ship.addModule(this);
            this.ship = ship;
            return true;
        }
        else{
            console.log("Can't add module to hardpoint:" + hardpoint);
            return false;
        }
    }

    Module.prototype.remove = function(){
        this.ship.removeModule(this);
        for (var i = 0; i < this.children.length; i = i + 1){
            var childHardpoint = this.children[i];
            childHardpoint.removeChildModule();
        }
        this.children = [];
        this.parent.child = null;
        this.parent = null;
    }

    return Module;
});

