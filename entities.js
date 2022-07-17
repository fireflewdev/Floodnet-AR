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