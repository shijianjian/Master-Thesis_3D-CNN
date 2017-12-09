import * as nj from 'numjs';

declare const THREE;

import { CameraParams, VisualSettings } from '../../model/visual-settings'

class ThreeDLoader {

    static initRender(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
        let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer(({ 
            canvas: canvas,
            antialias: false,
            preserveDrawingBuffer: true
        } as THREE.WebGLRendererParameters));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        return renderer;
    }

    static buildCamera(canvas: HTMLCanvasElement, cameraParams: CameraParams): THREE.PerspectiveCamera {
        let camera: THREE.PerspectiveCamera;
        camera = new THREE.PerspectiveCamera(90, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
        camera.position.x = cameraParams.position_x;
        camera.position.y = cameraParams.position_y;
        camera.position.z = cameraParams.position_z;
        camera.up = new THREE.Vector3(0, 0, 1);

        camera.lookAt(new THREE.Vector3(
            cameraParams.look_x, 
            cameraParams.look_y, 
            cameraParams.look_z));
        
        return camera;
    }
}

export class PointCloudLoader extends ThreeDLoader {
    
    static calculate(pointcloud: number[][]): CameraParams {
        if (pointcloud.length == 0) {
            throw new RangeError("Empty point cloud");
        }

        let total_x: number = 0, 
            total_y: number = 0, 
            total_z: number = 0; // for calculating camera look at

        for(let i=0; i<pointcloud.length; i++) {
            total_x += pointcloud[i][0];
            total_y += pointcloud[i][1];
            total_z += pointcloud[i][2];
        }

        let ranges = PointCloudCalculations.findRanges(pointcloud);

        return {
            position_x: ranges.X_MAX + Math.abs(ranges.X_MAX),
            position_y: ranges.Y_MAX + Math.abs(ranges.Y_MAX),
            position_z: ranges.Z_MAX + Math.abs(ranges.Z_MAX),
            look_x: total_x/pointcloud.length,
            look_y: total_y/pointcloud.length,
            look_z: total_z/pointcloud.length
        }
    }

    static getPointsGeometry(pointcloud: number[][]): THREE.Geometry {
        let geometry: THREE.Geometry = new THREE.Geometry();
        let colors: THREE.Color[] = [];
        for(let i=0; i<pointcloud.length; i++) {
            // Hard code color
            colors.push(new THREE.Color(1, 0.5, 0));
            geometry.vertices.push(new THREE.Vector3(
                pointcloud[i][0],
                pointcloud[i][1],
                pointcloud[i][2]
            ));
        }
        geometry.colors = colors;
        return geometry;
    }

    static loadPoints(geometry: THREE.Geometry, pointsMaterialParams?: THREE.PointsMaterialParameters): THREE.Points {
        let params = pointsMaterialParams ? pointsMaterialParams : {
                size: 0.01,
                vertexColors: THREE.VertexColors,
                transparent: true,
                opacity: 1
            };
        let material = new THREE.PointsMaterial(params);
        let figure: THREE.Points = new THREE.Points(geometry, material);
        return figure;
    }

}

export class VoxelGridLoader extends ThreeDLoader {

    static calculate(voxelgrid: number[][][]): CameraParams {
        return {
            position_x: voxelgrid.length * 2,
            position_y: voxelgrid[0].length * 2,
            position_z: voxelgrid[0][0].length * 2,
            look_x: voxelgrid.length / 2,
            look_y: voxelgrid[0].length / 2,
            look_z: voxelgrid[0][0].length / 2
        }
    }

    static loadMesh(geometry: THREE.Geometry, meshBasicMaterial?: THREE.MeshBasicMaterial): THREE.Mesh {
        let params = meshBasicMaterial ? meshBasicMaterial : {
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1,
            wireframe: true,
        };
        let material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial(params);
        let figure: THREE.Mesh = new THREE.Mesh(geometry, material);
        return figure;
    }

    static voxelize(pointcloud: number[][]) {
        return PointCloudCalculations.voxelize(pointcloud);
    }

    static getVoxelMeshes(voxelgrid: number[][][]): THREE.Mesh[] {
        let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        let meshes: THREE.Mesh[] = [];
        
        for (let i = 0; i < voxelgrid.length; i++) {
            for (let j = 0; j < voxelgrid[i].length; j++) {
                for (let k = 0; k < voxelgrid[i][j].length; k++) {
                    if (voxelgrid[i][j][k] == 0) {
                        continue;
                    }
                    let materialSettings: THREE.MeshBasicMaterialParameters = {
                        wireframe: true,
                        transparent: true,
                        opacity: 0.3,
                        // Orange desity
                        color: new THREE.Color(1, 0.7-0.25*voxelgrid[i][j][k], 0)
                    }
                    let mesh: THREE.Mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(
                        materialSettings
                    ));
                    mesh.position.x = i;
                    mesh.position.y = j;
                    mesh.position.z = k;
                    meshes.push(mesh);
                }
            }
        }
        return meshes;
    }


}

namespace PointCloudCalculations {

    interface Ranges {
        X_MAX: number;
        Y_MAX: number;
        Z_MAX: number;
        X_MIN: number;
        Y_MIN: number;
        Z_MIN: number;
    }

    interface GridSize {
        X: number;
        Y: number;
        Z: number;
    }
    
    export function findRanges(pointcloud: number[][]): Ranges {
        let x_max: number = pointcloud[0][0], 
            x_min: number = pointcloud[0][0];
        let y_max: number = pointcloud[0][1], 
            y_min: number = pointcloud[0][1];
        let z_max: number = pointcloud[0][2], 
            z_min: number = pointcloud[0][2];

        for(let i=0; i<pointcloud.length; i++) {
            x_max = pointcloud[i][0] > x_max ? pointcloud[i][0] : x_max;
            y_max = pointcloud[i][1] > y_max ? pointcloud[i][1] : y_max;
            z_max = pointcloud[i][2] > z_max ? pointcloud[i][2] : z_max;

            x_min = pointcloud[i][0] < x_min ? pointcloud[i][0] : x_min;
            y_min = pointcloud[i][1] < y_min ? pointcloud[i][1] : y_min;
            z_min = pointcloud[i][2] < z_min ? pointcloud[i][2] : z_min;
        }

        return {
            X_MAX: x_max,
            Y_MAX: y_max,
            Z_MAX: z_max,
            X_MIN: x_min,
            Y_MIN: y_min,
            Z_MIN: z_min
        }
    }

    /**
     * Please make sure the pointcloud has been normalized.
     * 
     * Default GridSize is 32 x 32 x 32.
     */
    export function voxelize(pointcloud: number[][], gridsize?: GridSize): number[][][] {
        if (!gridsize) {
            gridsize = {X: 32, Y: 32, Z: 32};
        }
        let gridLength: GridSize = {
            X: 1/gridsize.X,
            Y: 1/gridsize.Y,
            Z: 1/gridsize.Z
        }

        let ranges = findRanges(pointcloud);
        const epsilon = 0.000000000001;
        let output: number[][][] = nj.zeros([gridsize.X, gridsize.Y, gridsize.Z]).tolist();
        let max_volume_size = 0;

        let x_loc, y_loc, z_loc;
        for (let pair of pointcloud) {
            x_loc = Math.floor(pair[0]/(gridLength.X + epsilon));
            y_loc = Math.floor(pair[1]/(gridLength.Y + epsilon));
            z_loc = Math.floor(pair[2]/(gridLength.Z + epsilon));

            output[x_loc][y_loc][z_loc] += 1;

            if (output[x_loc][y_loc][z_loc] > max_volume_size) {
                max_volume_size = output[x_loc][y_loc][z_loc];
            }
        }

        // normalization
        for (let i = 0; i < output.length; i++) {
            for (let j = 0; j < output[i].length; j++) {
                for (let k = 0; k < output[i][j].length; k++) {
                    output[i][j][k] = output[i][j][k]/max_volume_size;
                }
            }
        }

        return output;
    }

}