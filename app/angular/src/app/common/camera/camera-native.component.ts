import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { MeshBasicMaterial, PointsMaterial, Points, Mesh, Vector3 } from 'three';

import { DatGuiService } from './dat-gui.service';
import { GuiControllerTypes, GuiParameters } from './model/GUI';
import { PointCloudLoader, VoxelGridLoader } from './util/pointcloud-loader';
import { CameraParams, CanvasSettings } from './model/visual-settings';

declare const THREE;
declare const PLYLoader;
declare const OrbitControls;

@Component({
  selector: 'app-camera-native',
  templateUrl: './camera-native.component.html',
  styles: [`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }
  `]
})
export class CameraNativeComponent implements OnChanges {

    @Input() data: number[][] | number[][][];
    @Input() canvasSettings: CanvasSettings;

    renderer: THREE.WebGLRenderer;
    figure: Points | Mesh[];
    controls: THREE.OrbitControls;
    camera: THREE.PerspectiveCamera;
    scene : THREE.Scene = new THREE.Scene();

    @ViewChild('canvas')
    private canvasRef: ElementRef;
    @ViewChild('container')
    private containerRef: ElementRef;
    
    constructor(private $datGui: DatGuiService) {
        this.$datGui.controllers.subscribe((param: GuiParameters) => {
            if (this.figure && (this.figure as Points).type == "Points") {
                (<PointsMaterial>(this.figure as Points).material).setValues({
                    size: param.size,
                    opacity: param.opacity
                })
            }
            if (this.figure && this.figure[0] && this.figure[0].type == "Mesh") {
                (this.figure as Mesh[]).forEach(mesh => {
                    (<MeshBasicMaterial>mesh.material).setValues({
                        wireframe: param.wireframe,
                        opacity: param.opacity
                    })
                });
            }
        })
    }

    ngOnChanges() {
        if (!this.renderer) {
            this.renderer = PointCloudLoader.initRender(this.canvas);
        }
        if (this.canvasSettings) {
            let width = this.canvasSettings.width;
            let height = this.canvasSettings.height;
            this.renderer.setSize(width, height);
        } else {
            let width = this.canvas.clientWidth;
            let height = this.canvas.clientHeight;
            if (height*2 > width) {
                height = width/2;
            } else if (width/2 > height) {
                width = height*2;
            }
            this.renderer.setSize(width, height);
        }
        if (!this.data) {
            return;
        }
        if (this.scene.children.length > 0) {
            this.removeAll();
        }
        this.onRender(this.data);
    }

    private removeAll() {
        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }
        this.controls.removeEventListener('change', this.onControlChangeEvent);
        window.removeEventListener('resize', this.onWindowResizeEvent)
    }

    private onRender(data: number[][] | number[][][]) {
        if (!data || !data[0]) {
            return;
        }
        this.initScene(data);
        let cameraParams: CameraParams = this.getCameraParams(data);
        if (!this.camera) {
            this.camera = PointCloudLoader.buildCamera(this.canvas, cameraParams);    
        } else {
            this.camera = PointCloudLoader.updateCamera(this.camera, cameraParams)
        }
        if (!this.controls) {
            this.controls = this.initControl(cameraParams, this.camera);
        } else {
            this.controls.target.set(cameraParams.look_x, cameraParams.look_y, cameraParams.look_z);
            this.controls.update();
        }
        this.controls.addEventListener('change', this.onControlChangeEvent);
        window.addEventListener('resize', this.onWindowResizeEvent, false)
        this.animate(this.scene, this.camera);
    }

    private onControlChangeEvent = (event) => {
        this.render(this.scene, this.camera);
    };

    private onWindowResizeEvent = (event) => {
        this.onWindowResize(this.camera);
    }

    private getCameraParams(data: number[][] | number[][][]): CameraParams {
        let cameraParams: CameraParams;
        if (typeof data[0][0] == 'number') {
            cameraParams = PointCloudLoader.calculate((data as number[][]));
        } else if (data[0][0] && typeof data[0][0][0] == 'number') {
            cameraParams = VoxelGridLoader.calculate((data as number[][][]));
        } else {
            throw new TypeError("Not recognized array format");
        }
        return cameraParams;
    }

    get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    private initScene(data: number[][] | number[][][]): void {
        if (typeof data[0][0] == 'number') {
            let geometry = PointCloudLoader.getPointsGeometry((data as number[][]));
            let figure = PointCloudLoader.loadPoints(geometry, {
                size: this.$datGui.getParameters.size,
                vertexColors: THREE.VertexColors,
                transparent: true,
                opacity: this.$datGui.getParameters.opacity
            });
            this.figure = figure;
            this.scene.add(figure);
        } else if (typeof data[0][0][0] == 'number') {
            let meshes = VoxelGridLoader.getVoxelMeshes((data as number[][][]), {
                opacity: this.$datGui.getParameters.opacity,
                wireframe: this.$datGui.getParameters.wireframe
            });
            this.figure = meshes;
            meshes.forEach(mesh => {
                this.scene.add(mesh);
            })
        } else {
            throw new TypeError("Not recognized array format");
        }
    }

    private initControl(cameraSettings: CameraParams, camera: THREE.PerspectiveCamera): THREE.OrbitControls {
        
        let controls: THREE.OrbitControls = new THREE.OrbitControls(camera, this.renderer.domElement);
        controls.target.copy(new THREE.Vector3(
            cameraSettings.look_x, 
            cameraSettings.look_y, 
            cameraSettings.look_z));

        return controls;
    }

    private onWindowResize(camera) {
        let width = this.container.clientWidth;
        let height = this.container.clientHeight;
        if (height*2 > width) {
            height = width/2;
        } else if (width/2 > height) {
            width = height*2;
        }
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        requestAnimationFrame(() => this.animate);

        let light = new THREE.AmbientLight(0xFFFFFF, 1); // soft white light
        scene.add(light);

        this.render(scene, camera);
    }

    private render(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.renderer.render(scene, camera);
    }    

}
