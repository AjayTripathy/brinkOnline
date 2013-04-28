require.config({
    paths: {
        "jquery": "components/jquery/jquery",
        "underscore": "components/underscore/underscore",
        "Ship": "src/objects/Ship"
    },
    shim: {
        "underscore": {
            "exports": '_'
        },
        "Ship": {
            "exports": 'Ship'
        }
    }
});

require(['jquery', 'underscore'], function ($20, _144) {
    require(['Ship'], function (Ship1) {
        
    });
});