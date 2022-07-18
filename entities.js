//thanks hulkinBrain on stackoverflow
AFRAME.registerComponent("planepadder", {
    schema: {
        addPadding: { type: "boolean", default: false },
        padding: { type: "number", default: 0.01 }
    },
    init: function () {
        let data = this.data;
        this.el.setAttribute("planepadder", "addPadding: false");
    },
    update: function (oldData) {
        let data = this.data;
        let el = this.el;

        if (Object.keys(data).length === 0) { return; }

        /**
         * If the flag is true add padding to the plane
        */
        if (data.addPadding === true) {

            /**
             * Set padding using the provided padding value
            */

            var geom = el.getObject3D("mesh").geometry

            geom = new THREE.PlaneGeometry(
                el.components.geometry.data.width + el.components.planepadder.data.padding,
                el.components.geometry.data.height + el.components.planepadder.data.padding
            );

            /**
             * Remove planepadder attribute so that it padding can be 
             * changed in the future by adding the attribute again
            */
            this.el.removeAttribute("planepadder");
        }
    },
    tick(time, delta) {
        let data = this.data;
        let el = this.el;

        /**
         * Check if the width is not NaN, padding hasn't already been
         * added i.e `addPadding` schema attribute is false and that the 
         * plane's width is same as the text's width which means padding 
         * hasn't been added yet 
        */
        if (el.components.geometry.data.width != NaN && el.components.planepadder.data.addPadding === false && el.components.geometry.data.width == el.components.text.data.width) {
            // Set the schema attribute `addPadding` to true so that the padding can be added
            el.setAttribute("planepadder", "addPadding: true");
        }
    }
}
);

AFRAME.registerComponent('ocean', {
    schema: {
        // Dimensions of the ocean area.
        width: { default: 10, min: 0 },
        depth: { default: 10, min: 0 },

        // Density of waves.
        density: { default: 10 },

        // Wave amplitude and variance.
        amplitude: { default: 0.1 },
        amplitudeVariance: { default: 0.3 },

        // Wave speed and variance.
        speed: { default: 1 },
        speedVariance: { default: 2 },

        // Material.
        color: { default: '#7AD2F7', type: 'color' },
        opacity: { default: 0.8 }
    },

    /**
     * Use play() instead of init(), because component mappings – unavailable as dependencies – are
     * not guaranteed to have parsed when this component is initialized.
     */
    play: function () {
        const el = this.el,
            data = this.data;
        let material = el.components.material;

        const geometry = new THREE.PlaneGeometry(data.width, data.depth, data.density, data.density);
        geometry.mergeVertices();
        this.waves = [];
        for (let v, i = 0, l = geometry.vertices.length; i < l; i++) {
            v = geometry.vertices[i];
            this.waves.push({
                z: v.z,
                ang: Math.random() * Math.PI * 2,
                amp: data.amplitude + Math.random() * data.amplitudeVariance,
                speed: (data.speed + Math.random() * data.speedVariance) / 1000 // radians / frame
            });
        }

        if (!material) {
            material = {};
            material.material = new THREE.MeshPhongMaterial({
                color: data.color,
                transparent: data.opacity < 1,
                opacity: data.opacity,
                shading: THREE.FlatShading,
            });
        }

        this.mesh = new THREE.Mesh(geometry, material.material);
        el.setObject3D('mesh', this.mesh);
    },

    remove: function () {
        this.el.removeObject3D('mesh');
    },

    tick: function (t, dt) {
        if (!dt) return;

        const verts = this.mesh.geometry.vertices;
        for (let v, vprops, i = 0; (v = verts[i]); i++) {
            vprops = this.waves[i];
            v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
            vprops.ang += vprops.speed * dt;
        }
        this.mesh.geometry.verticesNeedUpdate = true;
    }
});