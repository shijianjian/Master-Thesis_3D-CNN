import { Component, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";

import { CameraDialogComponent } from "./camera-dialog.componnet";

@Component({
    selector: 'app-camera-dialog-viewer',
    templateUrl: 'camera-dialog-viewer.componenet.html'
})
export class CameraDialogViewerComponent implements OnChanges{

    @Input() element: HTMLElement;
    @Output() outputElement = new EventEmitter<HTMLElement>();

    constructor(public dialog: MatDialog) {}

    ngOnChanges() {

    }

    openDialog() {
        let dialogRef = this.dialog.open(CameraDialogComponent, {
          width: '80vw',
          height: '80vh',
          data: this.element
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog closed: ${result}`);
          this.outputElement.emit(result);
        });
      }

}