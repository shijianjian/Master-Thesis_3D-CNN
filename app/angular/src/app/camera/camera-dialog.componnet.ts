import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSliderChange, MatTabChangeEvent } from "@angular/material";
import { CameraNativeComponent } from "./camera-native.component";
import { PointCloudPostProcess } from "./util/pointcloud-post-process";
import { VoxelGridLoader } from "./util/pointcloud-loader";

@Component({
    selector: 'app-camera-dialog',
    templateUrl: 'camera-dialog.component.html',
})
export class CameraDialogComponent implements OnInit {

    @ViewChild('content')
    content: ElementRef;

    camera: CameraNativeComponent;
    noise = 0;

    voxelgrid;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CameraDialogComponent>) 
    {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {
        console.log(this.data);
        this.camera = this.data.camera;
        this.content.nativeElement.append(this.data.element);
        // fire resize camera
        window.dispatchEvent(new Event('resize'));
    }

    close() {
        this.dialogRef.close(this.data.element);
    }

    onSelectionChanged(event: MatTabChangeEvent) {
        if (this.data.pointcloud && event.index == 0) {
            // Point Cloud
            this.changeData(this.data.pointcloud);
        } else if (this.data.pointcloud && event.index == 1) {
            // Voxel Grid
            if(!this.voxelgrid) {
                this.voxelgrid = VoxelGridLoader.voxelize(this.data.pointcloud);
            }
            this.changeData(this.data.voxelgrid);
        }
    }

    onNoisy(e: MatSliderChange) {
        // let noisy = PointCloudPostProcess.addGaussianNoise(this.data.pointcloud, e.value/100);
        // this.camera.data = noisy;
        this.camera.ngOnChanges();
    }   

    private changeData(data : number[][] | number[][][]) {
        this.camera.data = data;
        this.camera.ngOnChanges();
    }
}