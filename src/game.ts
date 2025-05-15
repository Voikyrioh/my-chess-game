import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import type { PerspectiveCamera, Scene, WebGLRenderer} from "three";

import skybox from "./assets/skybox.jpg?url";
import assets from "./classes/assets.ts";

export class Game {
    #camera: PerspectiveCamera;
    #scene: Scene;
    #renderer: WebGLRenderer;
    #assets = assets;

    constructor(element: Element) {
        this.#scene = new THREE.Scene();
        this.#camera = new THREE.PerspectiveCamera( 75, element.clientWidth / element.clientHeight, 0.1, 1000 );
        this.#renderer = new THREE.WebGLRenderer();
        this.#renderer.setSize( element.clientWidth, element.clientHeight );
        element.appendChild( this.#renderer.domElement );
    }

    async init() {
        new OrbitControls( this.#camera, this.#renderer.domElement );
        this.#setupLights();
        await this.#setupSkybox();

        await this.#assets.loaded;
        this.#scene.add( assets.board);

        this.#camera.position.z = 30;
        this.#renderer.setAnimationLoop( () => {
            this.#renderer.render( this.#scene, this.#camera );
        } );
    }

    #setupLights() {
        this.#scene.add( new THREE.AmbientLight( 0x404040, 10 ) );
        const light = new THREE.DirectionalLight( 0xffffff, 3 );
        light.position.set( 1, 30, 30 );
        light.castShadow = true;
        light.lookAt( 0, 0, 0 );
        this.#scene.add( light );
    }

    async #setupSkybox() {
        const textureLoader = new THREE.TextureLoader();
        const skyboxTexture = await textureLoader.loadAsync(skybox);
        skyboxTexture.mapping = THREE.EquirectangularReflectionMapping;
        skyboxTexture.colorSpace = THREE.SRGBColorSpace;
        this.#scene.background = skyboxTexture;
    }
}
