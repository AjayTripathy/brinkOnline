define('Module', function() {
    function Module (options) {
        if (!(this instanceof Module)) return new Module();
    	
        options = util.extend({ 
            name: null,
            minPower: 0,
            maxPower: 0,
            type: null,
            weight: 100,
            parent: null,
            children: []
        }, options);
        util.extend(this, options);

        this.id = this.name + util.guid();
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
            ship.modules[this.id] =  this;
            return true;
        }
        else{
            console.log("Can't add module to hardpoint:" + hardpoint);
            return false;
        }
    }

    return Module;
});

