 define([
    'threejs',
    'stardome',
    'detector',
    'stats',
    'orbitcontrols',
    'convolutionshader',
    'copyshader',
    'fxaashader',
    'ssaoshader',
    'effectcomposer',
    'maskpass',
    'renderpass',
    'shaderpass',
    'bloompass'
], function (THREE, Stardome) {
    var camera, renderer, controls, projector, scene, stats, container, plane, composer, effectFXAA, effectSSAO, light;
    var depthMaterial, depthTarget;
    var sunSprite;
    var moonSprite;
    var starSprites = [];
    var stardome;

    var keyDict = {};
    var buttonDict = {};

    var SSAOScale = 0.75;

    var postprocessing = { enabled  : true };

    var dX = 5000;
    var dZ = 5000;

    var cameraMoveSpeed = 30;

    var clock = new THREE.Clock();

    var xVec = new THREE.Vector3(1,0,0);

    function init () {
        container = $("#container");

        camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 50, 10000);

        controls = new THREE.OrbitControls(camera);
        controls.addEventListener('change', render);
        // controls.autoRotate = true;

        camera.position.x = 2500;
        camera.position.y = 2500;
        camera.position.z = 2500;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x222222, 0.0001);

        // Model Loader
        // var loader = new THREE.JSONLoader();

        // Projector
        projector = new THREE.Projector();

        // Stats
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.append( stats.domElement );

        // Lights
        light = new THREE.DirectionalLight(0xffffff, 1, 10000);
        light.position.set(0, 1500, 0);
        light.castShadow = true;
        // light.shadowMapBias = 0.001
        light.shadowMapWidth = light.shadowMapHeight = 512;
        light.shadowCameraVisible = true;
        light.shadowCameraLeft = light.shadowCameraBottom = -2000;
        light.shadowCameraRight = light.shadowCameraTop = 2000;
        // light.shadowMapDarkness = .6;
        scene.add(light);

        // var ambientLight = new THREE.AmbientLight( 0x111111 );
        // scene.add( ambientLight );

        // World
        
        var mergedGeo = new THREE.Geometry();
        var mats = [];
        for (var i = 0; i < 100; i++) {
            var height = 100 + Math.random() * 100;
            var cubeGeometry = new THREE.CubeGeometry(100 + Math.random() * 100, height, 100 + Math.random() * 100);
            var cubeMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial());
            cubeMesh.position.set(Math.random() * 1000, height/2, Math.random() * 1000);
            THREE.GeometryUtils.merge(mergedGeo, cubeMesh);
        }
        scene.add(new THREE.Mesh(mergedGeo, new THREE.MeshPhongMaterial({color: 0xaaaaaa})));

        var planeGeo = new THREE.PlaneGeometry(dX, dZ);
        var planeMat = new THREE.MeshPhongMaterial({
            color: 0xffffff * Math.random(),
            side: THREE.DoubleSide
        });
        plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = Math.PI/2;
        plane.receiveShadow = true;
        scene.add(plane);

        stardome = new Stardome();
        scene.add(stardome.obj);

        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.setClearColor(scene.fog.color, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColorHex(0x222222, renderer.getClearAlpha());

        container.append(renderer.domElement);

        var depthShader = THREE.ShaderLib[ "depthRGBA" ];
        var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

        depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
        depthMaterial.blending = THREE.NoBlending;

        var renderModel = new THREE.RenderPass( scene, camera );
        var effectBloom = new THREE.BloomPass( 1, 9, 1.0, 1024 );
        var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
        effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        var width = window.innerWidth || 2;
        var height = window.innerHeight || 2;
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
        effectCopy.renderToScreen = true;

        effectSSAO = new THREE.ShaderPass( THREE.SSAOShader );
        depthTarget = new THREE.WebGLRenderTarget( SSAOScale * window.innerWidth, SSAOScale * window.innerHeight, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
        effectSSAO.uniforms[ 'tDepth' ].value = depthTarget;
        effectSSAO.uniforms[ 'size' ].value.set( SSAOScale * window.innerWidth, SSAOScale * window.innerHeight );
        effectSSAO.uniforms[ 'cameraNear' ].value = camera.near;
        effectSSAO.uniforms[ 'cameraFar' ].value = camera.far;
        effectSSAO.renderToScreen = true;

        composer = new THREE.EffectComposer( renderer );
        composer.addPass( renderModel );
        composer.addPass( effectFXAA );
        //composer.addPass( effectSSAO );
        //composer.addPass( effectBloom );
        //composer.addPass( effectCopy );


        window.addEventListener('resize', onWindowResize, false);
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        window.addEventListener('keydown', onDocumentKeyDown, false);
        window.addEventListener('keyup', onDocumentKeyUp, false);
    }

    function onWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
        effectSSAO.uniforms[ 'size' ].value.set( SSAOScale * window.innerWidth, SSAOScale * window.innerHeight );

        composer.reset();
    }

    function animate () {
        var delta = clock.getDelta();

        requestAnimationFrame(animate);
        render();
        controls.update();
        stats.update();

        keyControl();
    }

    function render () {
        //scene.overrideMaterial = depthMaterial;
        renderer.render( scene, camera );
        //renderer.render( scene, camera, depthTarget );

        scene.overrideMaterial = null;
        composer.render();

        stardome.setSunDir([light.position.x, light.position.y, light.position.z]);

    }

    function keyControl () {
        if (keyDict["37"]) {
            light.position.x -= cameraMoveSpeed;
        }
        if (keyDict["39"]) {
            light.position.x += cameraMoveSpeed;
        }
        if (keyDict["38"]) {
            light.position.z += cameraMoveSpeed;
        }
        if (keyDict["40"]) {
            light.position.z -= cameraMoveSpeed;
        }
        if (keyDict["16"]) {
            light.position.y += cameraMoveSpeed;
        }
        if (keyDict["32"]) {
            light.position.y -= cameraMoveSpeed;
        }
    }

    function onDocumentMouseDown (event) {
        if (event.button == 0) {
            event.preventDefault();
        }
    }

    function onDocumentKeyDown (event) {
        keyDict[event.keyCode] = true;
    }

    function onDocumentKeyUp (event) {
        keyDict[event.keyCode] = false;
    }

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        init();
        animate();
    }

});