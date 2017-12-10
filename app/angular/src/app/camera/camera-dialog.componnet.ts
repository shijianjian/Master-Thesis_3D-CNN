import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSliderChange } from "@angular/material";
import { CameraNativeComponent } from "./camera-native.component";
import { PointCloudPostProcess } from "./util/pointcloud-post-process";

@Component({
    selector: 'app-camera-dialog',
    templateUrl: 'camera-dialog.component.html',
})
export class CameraDialogComponent implements OnInit {

    @ViewChild('content')
    content: ElementRef;

    camera: CameraNativeComponent;
    processor: PointCloudPostProcess;
    noise = 0;

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
        this.processor = new PointCloudPostProcess(this.data.pointcloud);
        // fire resize camera
        window.dispatchEvent(new Event('resize'));
    }

    close() {
        this.dialogRef.close(this.data.element);
    }

    onNoisy(e: MatSliderChange) {
        let noisy = this.processor.addGaussianNoise(e.value/100);
        this.camera.data = noisy;
        this.camera.ngOnChanges();
    }   
}