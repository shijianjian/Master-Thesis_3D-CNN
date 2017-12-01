import { Component, OnInit, Input } from '@angular/core';

import * as dat from 'dat.gui/build/dat.gui.js'
import { MeshBasicMaterialParameters, Color, Camera, Material } from 'three';

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
export class CameraComponent implements OnInit {

  @Input() settings: CameraSettings = {
    CAMERA_X: null,
    CAMERA_Y: null,
    CAMERA_Z: null,
  
    LOOK_X: null,
    LOOK_Y: null,
    LOOK_Z: null,
  
    POINTS_X: null,
    POINTS_Y: null,
    POINTS_Z: null,
  
    R: null,
    G: null,
    B: null,
  
    S_x: null,
    S_y: null,
    S_z: null,
  
    N_VOXELS: null,
    AXIS_SIZE: null,
  
    FILENAME: 'assets/test/pyntcloud_plot',
    POINT_SIZE: 0.005,
  };

  constructor() {}

  container; 
  stats;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene; 
  renderer: THREE.WebGLRenderer; 
  controls: THREE.OrbitControls;
  points;
  loader;

  ngOnInit() {
    this.init();
    this.animate();
  }

  private init() {

    let camera_x = this.settings.CAMERA_X;
    let camera_y = this.settings.CAMERA_Y;
    let camera_z = this.settings.CAMERA_Z;

    let look_x = this.settings.LOOK_X;
    let look_y = this.settings.LOOK_Y;
    let look_z = this.settings.LOOK_Z;

    let X = new Float32Array(this.settings.POINTS_X);
    let Y = new Float32Array(this.settings.POINTS_Y);
    let Z = new Float32Array(this.settings.POINTS_Z);

    let R = new Float32Array(this.settings.R);
    let G = new Float32Array(this.settings.G);
    let B = new Float32Array(this.settings.B);

    let S_x = this.settings.S_x;
    let S_y = this.settings.S_y;
    let S_z = this.settings.S_z;

    let n_voxels = this.settings.N_VOXELS;
    let axis_size = this.settings.AXIS_SIZE;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.x = camera_x;
    this.camera.position.y = camera_y;
    this.camera.position.z = camera_z;
    this.camera.up = new THREE.Vector3(0, 0, 1);

    if (axis_size > 0) {
        let axisHelper = new THREE.AxisHelper(axis_size);
        this.scene.add(axisHelper);
    }

    let geometry = new THREE.BoxGeometry(S_x, S_z, S_y);
    
    for (let i = 0; i < n_voxels; i++) {
        let materialSettings: MeshBasicMaterialParameters = {
            wireframe: true,
            transparent: true,
            opacity: 0.3,
            color: new Color(R[i], G[i], B[i])
        }
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(
            materialSettings
        ));
        mesh.position.x = X[i];
        mesh.position.y = Y[i];
        mesh.position.z = Z[i];
        this.scene.add(mesh);
    }

    // Point Cloud Renderer
    let filename = this.settings.FILENAME;
    let parameters =
    {
        size: 0.5,
        opacity: 1,
        wireframe: true,
    };
    const gui = new dat.GUI();
    //
    // LOADER
    //
    let material: THREE.Material;
    let figure;
    this.loader = new PLYLoader();
    this.loader.load(filename + '.ply', (geometry) => {
        console.log(geometry)
        if (geometry.index) {
            material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                transparent: true,
                opacity: 1,
                wireframe: true,
            });
            figure = new THREE.Mesh(geometry, material);
          var figureMaterial = gui.add(parameters, 'wireframe').name('Wireframe').listen();
        //   figureMaterial.onChange((value) => {
        //       (figure.material as Material).setValues({
        //           wireframe: value
        //         });
        //   });
        } else {
            material = new THREE.PointsMaterial({
                size: this.settings.POINT_SIZE,
                vertexColors: THREE.VertexColors,
                transparent: true,
                opacity: 1,
            });
            figure = new THREE.Points(geometry, material);
          var figureSize = gui.add(parameters, 'size').min(0.001).max(1).step(0.001).name("Point Size").listen();
        //   figureSize.onChange((value) => {
        //     (figure.material as Material).setValues({
        //         size: value
        //     });
        //   });
        }

        let figureOpacity = gui.add(parameters, 'opacity').min(0.1).max(1).step(0.1).name('Opacity').listen();
        figureOpacity.onChange((value) => {
            (figure.material as Material).setValues({
                opacity: value
            })
        });
        this.scene.add(figure);
    });

    var light = new THREE.AmbientLight(0xFFFFFF, 1); // soft white light
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ 
        antialias: false,
        preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(new THREE.Vector3(look_x, look_y, look_z));
    this.camera.lookAt(new THREE.Vector3(look_x, look_y, look_z));

    this.container = document.getElementById('container');
    this.container.appendChild(this.renderer.domElement);

    // window.addEventListener('resize', this.onWindowResize, false);
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate() {
        // requestAnimationFrame(this.animate);
        this.render();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }    

}
