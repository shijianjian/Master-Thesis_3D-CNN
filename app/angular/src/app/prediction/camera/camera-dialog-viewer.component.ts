import { Component, Input, OnChanges, Output, EventEmitter, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material";

import { CameraDialogComponent } from "./camera-dialog.componnet";
import { CameraNativeComponent } from "./camera-native.component";

@Component({
    selector: 'app-camera-dialog-viewer',
    templateUrl: 'camera-dialog-viewer.componenet.html'
})
export class CameraDialogViewerComponent implements OnChanges{

    @Input() element: HTMLElement;
    @Input() camera: CameraNativeComponent;
    @Input() pointcloud: number[][];
    @Output() outputElement = new EventEmitter<HTMLElement>();

    constructor(public dialog: MatDialog) {}

    ngOnChanges() {

    }

    openDialog() {
        let dialogRef = this.dialog.open(CameraDialogComponent, {
          width: '85vw',
          height: '85vh',
          data: {
            element: this.element,
            camera: this.camera,
            pointcloud: this.pointcloud
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog closed: ${result}`);
          this.outputElement.emit(result);
        });
      }

}