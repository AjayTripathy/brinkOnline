define(['hardpoint', 'util'], function(HardPoint, util) {
    function ShipModule (options) {
        if (!(this instanceof ShipModule)) return new ShipModule();
    	
        options = util.extend({ 
            name: null,
            minPower: 0,
            maxPower: 0,
            type: null,
            weight: 100,
            parent: null,
            numHardPoints: 0
        }, options);
        util.extend(this, options);

        this.id = this.name + util.guid();
        this.ship = null;
        this.children = []
        for (var i = 0; i < this.numHardPoints; i = i + 1){
            this.children.push(new HardPoint(this, {}));
        }
    }


    /**
     *called when the module takes damage
     *@param damageObj : a damage object 
    */

    ShipModule.prototype._takeDamage = function (damageObj) {
        
    }

    ShipModule.prototype.getHardPoint = function (position){
        return this.children[position];
    }

    ShipModule.prototype.add = function(module, hardPointPosition){
        var hardPoint = module.getHardPoint(hardPointPosition);
        var ship = module.ship;
        if ( hardPoint.validateShipModule() ){
            hardPoint.addShipModule(this);
            this.parent = hardPoint;
            ship.addShipModule(this);
            this.ship = ship;
            return true;
        }
        else{
            console.log("Can't add ship module to hardpoint:" + hardpoint);
            return false;
        }
    }

    ShipModule.prototype.remove = function(){
        this.ship.removeShipModule(this);
        for (var i = 0; i < this.children.length; i = i + 1){
            var childHardpoint = this.children[i];
            childHardpoint.removeChildShipModule();
        }
        this.children = [];
        this.parent.children = [];
        this.parent = null;
    }

    return ShipModule;
});

