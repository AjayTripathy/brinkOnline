define(function() {
	function Hardpoint(parentModule, options){
		if (!(this instanceof Hardpoint)) return new Hardpoint();
		
		options = util.extend({ 
			maxWeight : 100,
			threeObj = null
		}, options);
		util.extend(this, options);

		this.parent = parentModule;
		this.children = [];
	}

	Hardpoint.prototype.addModule = function(module){
		//TODO: check if the hardpoint can handle the module
		if(this._validateModule(module)){
			this.children = [module];
			return true;
		}
		else{
			return false;
		}
	}

	Hardpoint.prototype.validateModule = function(module){
		return true;
	}

	Hardpoint.prototype.removeChildModule = function(){
		childModule = this.children[0];
		childModule.remove();
		this.children = [];
	}

	return Hardpoint;
});