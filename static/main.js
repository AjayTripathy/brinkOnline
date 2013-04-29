require.config({
    paths: {
        "jquery": "components/jquery/jquery",
        "underscore": "components/underscore/underscore",
        "util": "lib/util",
        "ship": "src/objects/ship",
        "shipmodule": "src/objects/shipmodule",
        "hardpoint": "src/objects/hardpoint",
        "area": "src/objects/area",
        "stardome": "src/world/stardome",
        "world": "src/world/world",
        "threejs": "components/threejs/build/three.min",
        "detector": "components/threejs/examples/js/Detector",
        "stats": "components/threejs/examples/js/libs/stats.min",
        "orbitcontrols": "components/threejs/examples/js/controls/OrbitControls",
        "convolutionshader": "components/threejs/examples/js/shaders/ConvolutionShader",
        "copyshader": "components/threejs/examples/js/shaders/CopyShader",
        "fxaashader": "components/threejs/examples/js/shaders/FXAAShader",
        "ssaoshader": "components/threejs/examples/js/shaders/SSAOShader",
        "effectcomposer": "components/threejs/examples/js/postprocessing/EffectComposer",
        "maskpass": "components/threejs/examples/js/postprocessing/MaskPass",
        "renderpass": "components/threejs/examples/js/postprocessing/RenderPass",
        "shaderpass": "components/threejs/examples/js/postprocessing/ShaderPass",
        "bloompass": "components/threejs/examples/js/postprocessing/BloomPass"
    },
    shim: {
        "jquery": {
            "exports": '$'
        },
        "underscore": {
            "exports": '_'
        },
        "threejs": {
            "exports": 'THREE'
        },
        "detector": {
            deps: ['threejs']
        },
        "stats": {
            deps: ['threejs']
        },
        "orbitcontrols": {
            deps: ['threejs']
        },
        "convolutionshader": {
            deps: ['threejs']
        },
        "copyshader": {
            deps: ['threejs']
        },
        "fxaashader": {
            deps: ['threejs']
        },
        "ssaoshader": {
            deps: ['threejs']
        },
        "effectcomposer": {
            "deps": ['copyshader']
        },
        "maskpass": {
            deps: ['threejs']
        },
        "renderpass": {
            deps: ['threejs']
        },
        "shaderpass": {
            deps: ['threejs']
        },
        "bloompass": {
            "deps": ['copyshader', 'convolutionshader', 'threejs']
        }
    }
});

require(['ship','shipmodule', 'hardpoint'], function (Ship, ShipModule, Hardpoint) {
    //TEST CODE
    core = new ShipModule({name: "core", numHardPoints: 5});
    gunz = new ShipModule({name: "gun", numHardPoints: 1});
    shieldz = new ShipModule({name: "shield", numHardPoints: 0})
    sh = new Ship({});
    sh.addCoreModule(core);
    gunz.add(core, 0);
    shieldz.add(gunz, 0);
    gunz.remove();
});
require(['world'], function () {
    console.log('world loaded!');
});