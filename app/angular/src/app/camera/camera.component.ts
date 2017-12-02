import { Component, OnInit, OnChanges, Input } from '@angular/core';

import * as dat from 'dat.gui/build/dat.gui.js'
import { MeshBasicMaterialParameters, MeshBasicMaterial, PointsMaterial,
    Color, Camera, Material, BoxGeometry } from 'three';

import 'assets/js/three.min'
import 'assets/js/PLYLoader';
import 'assets/js/OrbitControls';
import { CameraSettings } from '../model/camera-settings';
declare const THREE;
declare const PLYLoader;
declare const OrbitControls;

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnChanges {

    @Input() settings: CameraSettings;

    renderer: THREE.WebGLRenderer;
    gui = new dat.GUI();
    private parameters = {
        size: 0.01,
        opacity: 1,
        wireframe: true,
    };

    ngOnInit() {
        this.renderer = this.setRender();
    }

    ngOnChanges() {
        this.onRender();
    }

    onRender() {
        if (typeof this.settings =='undefined')
            return;
        let cameraSettings = this.processProperties(this.settings);
        let camera = this.buildCamera(cameraSettings);
        this.init(cameraSettings, camera);
    }

    private processProperties(settings: CameraSettings): CameraSettings {
        return {
            CAMERA_X: settings.CAMERA_X,
            CAMERA_Y: settings.CAMERA_Y,
            CAMERA_Z: settings.CAMERA_Z,
            LOOK_X: settings.LOOK_X,
            LOOK_Y: settings.LOOK_Y,
            LOOK_Z: settings.LOOK_Z,
            POINTS_X: new Float32Array(settings.POINTS_X),
            POINTS_Y: new Float32Array(settings.POINTS_Y),
            POINTS_Z: new Float32Array(settings.POINTS_Z),
            R: new Float32Array(settings.R),
            G: new Float32Array(settings.G),
            B: new Float32Array(settings.B),
            S_x: settings.S_x,
            S_y: settings.S_y,
            S_z: settings.S_z,
            N_VOXELS: settings.N_VOXELS,
            AXIS_SIZE: settings.AXIS_SIZE,
            FILENAME: settings.FILENAME
        }
    }

    private buildCamera(cameraSettings: CameraSettings): THREE.PerspectiveCamera {
        let camera: THREE.PerspectiveCamera;
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.x = cameraSettings.CAMERA_X;
        camera.position.y = cameraSettings.CAMERA_Y;
        camera.position.z = cameraSettings.CAMERA_Z;
        camera.up = new THREE.Vector3(0, 0, 1);

        camera.lookAt(new THREE.Vector3(
            cameraSettings.LOOK_X, 
            cameraSettings.LOOK_Y, 
            cameraSettings.LOOK_Z));

        window.addEventListener('resize', (event) => {
            return this.onWindowResize(camera)
        }, false);
        
        return camera;
    }

    private initControl(cameraSettings: CameraSettings, camera: THREE.PerspectiveCamera): THREE.OrbitControls {
        
        let controls: THREE.OrbitControls = new THREE.OrbitControls(camera, this.renderer.domElement);
        controls.target.copy(new THREE.Vector3(
            cameraSettings.LOOK_X, 
            cameraSettings.LOOK_Y, 
            cameraSettings.LOOK_Z));

        return controls;
    }

    private init(cameraSettings: CameraSettings, camera: THREE.PerspectiveCamera) {
        let scene: THREE.Scene = new THREE.Scene();; 

        if (cameraSettings.AXIS_SIZE > 0) {
            let axisHelper = new THREE.AxisHelper(cameraSettings.AXIS_SIZE);
            scene.add(axisHelper);
        }

        let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(
            cameraSettings.S_x, 
            cameraSettings.S_y, 
            cameraSettings.S_z
        );
        
        for (let i = 0; i < cameraSettings.N_VOXELS; i++) {
            let materialSettings: MeshBasicMaterialParameters = {
                wireframe: true,
                transparent: true,
                opacity: 0.3,
                color: new Color(
                    cameraSettings.R[i], 
                    cameraSettings.G[i], 
                    cameraSettings.B[i]
                )
            }
            let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(
                materialSettings
            ));
            mesh.position.x = cameraSettings.POINTS_X[i];
            mesh.position.y = cameraSettings.POINTS_Y[i];
            mesh.position.z = cameraSettings.POINTS_Z[i];
            scene.add(mesh);
        }

        // Point Cloud Renderer
        let filename = cameraSettings.FILENAME;
        
        let material: THREE.Material;
        let loader = new THREE.PLYLoader();
        loader.load(filename, (geometry) => {
            if (geometry.index) {
                let figure = this.loadMeshPLY(geometry, this.gui, this.parameters);
                scene.add(figure);
            } else {
                let figure = this.loadPointsPLY(geometry, this.gui, this.parameters);
                scene.add(figure);
            }
            var light = new THREE.AmbientLight(0xFFFFFF, 1); // soft white light
            scene.add(light);

            let controls = this.initControl(cameraSettings, camera);
            controls.addEventListener('change', (event) => {
                this.render(scene, camera)
            });
            let container = document.getElementById('container');
            container.appendChild(this.renderer.domElement);
            // fix async
            this.animate(scene, camera);
        });

    }

    private loadPointsPLY(geometry, gui, parameters) {
        let material = new THREE.PointsMaterial({
            size: parameters.size,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1
        });
        let figure = new THREE.Points(geometry, material);
        // GUI panels
        let figureSize = gui.add(parameters, 'size').min(0.001).max(1).step(0.001).name("Point Size").listen();
        figureSize.onChange((value) => {
            (figure.material as PointsMaterial).setValues({
                size: value
            });
        });
        let figureOpacity = gui.add(parameters, 'opacity').min(0.1).max(1).step(0.1).name('Opacity').listen();
        figureOpacity.onChange((value) => {
            (figure.material as Material).setValues({
                opacity: value
            })
        });
        return figure;
    }

    private loadMeshPLY(geometry, gui, parameters) {
        let material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1,
            wireframe: true,
        });
        let figure = new THREE.Mesh(geometry, material);
        let figureMaterial = gui.add(parameters, 'wireframe').name('Wireframe').listen();
        // GUI panels
        figureMaterial.onChange((value) => {
            (figure.material as MeshBasicMaterial).setValues({
                wireframe: value
            });
        });
        let figureOpacity = gui.add(parameters, 'opacity').min(0.1).max(1).step(0.1).name('Opacity').listen();
        figureOpacity.onChange((value) => {
            (figure.material as Material).setValues({
                opacity: value
            })
        });
        return figure;
    }

    private onWindowResize(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        requestAnimationFrame(() => this.animate);
        this.render(scene, camera);
    }

    private setRender(): THREE.WebGLRenderer {
        let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ 
            antialias: false,
            preserveDrawingBuffer: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    private render(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.renderer.render(scene, camera);
    }    

}
