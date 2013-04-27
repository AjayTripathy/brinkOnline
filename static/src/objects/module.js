function Module () {
    if (!(this instanceof Module)) return new Module();
	
    this.name;
    this.id; 	
    this.minPower;
    this.maxPower;
    this.type;
    this.weight;

    this.hardpoints = [];
    this.parent;
}


/**
    *called when the player adds to their ship
    *@param module : an instance of the module class
*//

Module.prototype._takeDamage = function (damage) {
    
}

Module.prototype.add = function(parentModule) {
    this.parent = parentModule;
}