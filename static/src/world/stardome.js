define(['threejs'], function(THREE) {
    /**
     * Default values
     * TODO (fmeyer): Add support for multiple services interacting with single control elements
     * so as to allow skybox to be instantiated within inserting into light service
     * or allow light service to communicate with the stardome service.
     */

    // Sun light initial direction
    var DEFAULT_DIR = new THREE.Vector3(0,0,1);

    // Default radius of the stardome
    var DEFAULT_RADIUS = 4000;

    // Default detail of the polygon for the stardome
    var DEFAULT_DETAIL = 20;

    // Path for image files for stardome
    var DEFAULT_PATH = '/img/stardome/';

    function Stardome() {
        this.lightPos = DEFAULT_DIR.clone();
        this.radius = DEFAULT_RADIUS;
        var self = this;

        // Instantiate stardome material which is a custom shader 
        // that changes the dome's color based on the position of the sun light.

        // The position in the two textures (one for sky and one for sunset and night coloring)
        // determines the color of the sky at that fragment position and colors the sky
        // in a nice gradient depending on location relative to sky and the angle of the sun.
        this.stardomeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glow: {
                    type: "t",
                    value: THREE.ImageUtils.loadTexture(DEFAULT_PATH+"glow2.png")
                },
                color: {
                    type: "t",
                    value: THREE.ImageUtils.loadTexture(DEFAULT_PATH+"sky2.png")
                },
                lightDir: {
                    type: "v3",
                    value: self.lightPos
                }
            },
            vertexShader: [
                "varying vec3 vWorldPosition;",
                "varying vec3 vPosition;",
                "void main() {",
                    "vec4 worldPosition = modelMatrix * vec4(position, 1.0);",
                    "vWorldPosition = worldPosition.xyz;",
                    "vPosition = position;",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                "}"
            ].join("\n"),
            fragmentShader: [
                "uniform sampler2D glow;",
                "uniform sampler2D color;",
                "uniform vec3 lightDir;",
                "varying vec3 vWorldPosition;",
                "varying vec3 vPosition;",
                "void main() {",
                    "vec3 V = normalize(vWorldPosition.xyz);",
                    "vec3 L = normalize(lightDir.xyz);",
                    "float vl = dot(V, L);",
                    "vec4 Kc = texture2D(color, vec2((L.y + 1.0) / 2.0, V.y));",
                    "vec4 Kg = texture2D(glow,  vec2((L.y + 1.0) / 2.0, vl));",
                    "gl_FragColor = vec4(Kc.rgb + Kg.rgb * Kg.a / 2.0, Kc.a);",
                "}"
            ].join("\n")
        });

        // Sun sprite material
        this.sunMaterial = new THREE.SpriteMaterial({
            map: THREE.ImageUtils.loadTexture(DEFAULT_PATH+"sun.png"),
            useScreenCoordinates: false,
            color: 0xffffff
        });

        // Moon sprite material
        this.moonMaterial = new THREE.SpriteMaterial({
            map: THREE.ImageUtils.loadTexture(DEFAULT_PATH+"moon.png"),
            useScreenCoordinates: false,
            color: 0xffffff
        });

        var skyObj = new THREE.Object3D();

        // Add stardome
        this.stardome = new THREE.Mesh(
            new THREE.SphereGeometry(1, DEFAULT_DETAIL, DEFAULT_DETAIL),
            this.stardomeMaterial
        );
        this.stardome.scale.set(DEFAULT_RADIUS, DEFAULT_RADIUS, DEFAULT_RADIUS);
        this.stardome.scale.x *= -1;
        skyObj.add(this.stardome)

        // Add sun
        this.sunSprite = new THREE.Sprite(this.sunMaterial);
        this.setSpriteLocation(this.sunSprite, this.lightPos, 1, this.radius);
        this.sunSprite.scale.set(DEFAULT_RADIUS/5, DEFAULT_RADIUS/5, 1);
        skyObj.add(this.sunSprite);

        // Add moon
        this.moonSprite = new THREE.Sprite(this.moonMaterial);
        this.setSpriteLocation(this.moonSprite, this.lightPos, -1, this.radius);
        this.moonSprite.scale.set(DEFAULT_RADIUS/5, DEFAULT_RADIUS/5, 1);
        skyObj.add(this.moonSprite);

        this.obj = skyObj;
    }

    /**
     * Sets a sprite location based on direction and radius
     * @param {THREE.Sprite} sprite  sprite to move
     * @param {THREE.Vector3} direction  direction to put sprite in
     * @param {Number} flagDir  -1 or 1 depending on if want to go in dir or opposite
     * @param {Number} radius  radius or stardome to place sprite within
     * @param {Number} scale  scale of how far within the radius to place sprite
     */
    Stardome.prototype.setSpriteLocation = function(sprite, direction, flagDir, radius, scale) {
        sprite.position.copy(direction);
        sprite.position.normalize();
        sprite.position.multiplyScalar(flagDir * radius * scale);
    }

    /**
     * Sets the light position correctly and adjusts the sprites`
     * @param {[x,y,z]} xyz  light direction as an array
     */
    Stardome.prototype.setSunDir = function(xyz) {
        this.lightPos.set(xyz[0], xyz[1], xyz[2]).normalize();
        this.setSpriteLocation(this.sunSprite, this.lightPos, 1, this.radius, 0.9);
        this.setSpriteLocation(this.moonSprite, this.lightPos, -1, this.radius, 0.9);
    }
    
    return Stardome;
});
