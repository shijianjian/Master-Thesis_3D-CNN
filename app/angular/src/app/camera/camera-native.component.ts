import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { MeshBasicMaterial, PointsMaterial, Points, Mesh } from 'three';

import { CameraGuiService } from '../camera-gui.service';
import { GuiControllerTypes, GuiParameters } from '../model/GUI';
import { MatTabChangeEvent } from '@angular/material';
import { PointCloudLoader, VoxelGridLoader } from './util/pointcloud-loader';
import { CameraParams } from '../model/visual-settings';

declare const THREE;
declare const PLYLoader;
declare const OrbitControls;

@Component({
  selector: 'app-camera-native',
  templateUrl: './camera-native.component.html'
})
export class CameraNativeComponent implements OnChanges {

    @Input() pointcloud: number[][];
    voxelgrid: number[][][];

    renderer: THREE.WebGLRenderer;
    figure: Points | Mesh[];
    scene : THREE.Scene = new THREE.Scene();

    @ViewChild('canvas')
    private canvasRef: ElementRef;
    
    constructor(private $cameraGui: CameraGuiService) {
        this.$cameraGui.controllers.subscribe((param: GuiParameters) => {
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
        if (!this.pointcloud) {
            return;
        }
        if (!this.renderer) {
            this.renderer = PointCloudLoader.initRender(this.canvas);
        }
        if (this.scene.children.length > 0) {
            this.removeAll();
            this.voxelgrid = undefined;
        }
        this.onRender(this.pointcloud);
    }

    onSelectionChanged(event: MatTabChangeEvent) {
        this.removeAll();
        if (this.pointcloud && event.index == 0) {
            // Point Cloud
            this.onRender(this.pointcloud);
        } else if (this.pointcloud && event.index == 1) {
            // Voxel Grid
            if(!this.voxelgrid) {
                this.voxelgrid = VoxelGridLoader.voxelize(this.pointcloud);
            }
            this.onRender(this.voxelgrid);
        }
    }

    private removeAll() {
        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }
    }

    private onRender(data: number[][] | number[][][]) {
        if (data && typeof data[0][0] == 'number') {
            let cameraSettings = PointCloudLoader.calculate((data as number[][]));
            let camera = PointCloudLoader.buildCamera(this.canvas, cameraSettings);
            this.init(cameraSettings, camera, (data as number[][]));
        } else if (data && typeof data[0][0][0] == 'number') {
            let cameraSettings = VoxelGridLoader.calculate((data as number[][][]));
            let camera = VoxelGridLoader.buildCamera(this.canvas, cameraSettings);
            this.init(cameraSettings, camera, (data as number[][][]));
        } else {
            throw new TypeError("Not recognized array format");
        }
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private init(cameraParams: CameraParams, camera: THREE.PerspectiveCamera, data: number[][] | number[][][]) {
        if (typeof data[0][0] == 'number') {
            let geometry = PointCloudLoader.getPointsGeometry((data as number[][]));
            let figure = PointCloudLoader.loadPoints(geometry);
            this.figure = figure;
            this.scene.add(figure);
        } else if (typeof data[0][0][0] == 'number') {
            let meshes = VoxelGridLoader.getVoxelMeshes((data as number[][][]));
            this.figure = meshes;
            meshes.forEach(mesh => {
                this.scene.add(mesh);
            })
        } else {
            throw new TypeError("Not recognized array format");
        }
        let controls = this.initControl(cameraParams, camera);
        controls.addEventListener('change', (event) => {
            this.render(this.scene, camera)
        });
        this.animate(this.scene, camera);
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
        camera.aspect = this.canvas.clientWidth/this.canvas.clientHeight;
        camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
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
