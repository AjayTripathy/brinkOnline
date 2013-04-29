define(['util'] ,function(util) {
    function Ship (options) {
        if (!(this instanceof Ship)) return new Ship();

        options = util.extend({
            shipModules: {},
            coreShipModule: null 
        }, options);
        util.extend(this, options);

        //ship stats as computed from the layout and modules
        this.health = 0;
        this.speed = 0;
        this.powerBank = 0;
        this.oxygenPercent = 0;
        this.crewCount = 0;
        this.moneys = 0;
        this.weight = 0;


        //combad stuff
        this.combatOrders = {}

        //game board stuff
        this.area = {}
        this.engagedShips = {}
    }

    //high level ship moves

    /**
     * enter combat with a ship in the area
     * @param shipId : the id of a ship to engage
     */
    Ship.prototype.engageShip = function(shipId) {
        
    }

    /**
     * move your ship to an area conencted to the area
     * @param destinationArea : id of area connected to this area
    **/
    Ship.prototype.changeArea = function(destinationArea){
        
    }

    /**
     * the standby order to get moneys
     */
    Ship.prototype.mine = function(){
        
    }

    //ship construction functions

    /**
        *called when the player adds to their ship
        *@param module : an instance of the module class
    */

    Ship.prototype.addCoreModule = function(module){
        this.shipModules[module.id] = module;
        this.coreShipModule = module;
        module.ship = this;
    }

    Ship.prototype.addShipModule =  function(module) {
        this.shipModules[module.id] = module;
    }

    Ship.prototype.removeShipModule = function(module){
        delete this.shipModules[module.id];
    }


    //ship combat data

    /**
     * subtract power from the powerbanks to add to the specified module
     * @param module : int
     * @param moduleId : name of module to modify
    */
    Ship.prototype.allocatePower = function(power, moduleId){
        
    }

    /**
     * modify the ship's orders object with a particular order to be executed in combat
     * @param order : TODO: Define order
     */
    Ship.prototype.assignOrder = function(order){
        
    }



    //the following functions are for internal gameplay, computations 
    //they are called by messages from the server to update the client's internal representation of the ships

    /**
     * uses the orders to come up with commands for the combat sim
     */
    Ship.prototype._executeOrders = function(){
      
    }

    /**
     * modify this ship's health and modules
     * @param damageObj : [{to be determined}, {} , {}] TODO: Define Damage Object
     * @param targetObj : {targetShip: shipId , targetModule: moduleType}
    */
    Ship.prototype._takeDamage = function(damageObj , targetObj){
        
    }

    /**
     * constructs and returns a damage object for this turn based on this power allocations and weapons
     * @param targetObj : {targetShip: shipId , targetModule: moduleType}
     * 
     */
    Ship.prototype._useWeapons = function (targetObj){
        
    }
    
    return Ship;
});
