define(['util'],function(util) {
	function Hardpoint(parentShipModule, options){
		if (!(this instanceof Hardpoint)) return new Hardpoint();
		
		options = util.extend({ 
			maxWeight : 100,
			position: 0
		}, options);
		util.extend(this, options);
		
		this.parent = parentShipModule;
		this.children = [];
	}

	Hardpoint.prototype.addShipModule = function(module){
		//TODO: check if the hardpoint can handle the module
		if(this.validateShipModule(module)){
			this.children = [module];
			return true;
		}
		else{
			return false;
		}
	}

	Hardpoint.prototype.validateShipModule = function(module){
		return true;
	}

	Hardpoint.prototype.removeChildShipModule = function(){
		var childShipModule = this.children[0];
		childShipModule.remove();
		this.children = [];
	}

	return Hardpoint;
});