import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-camera-dialog',
    templateUrl: 'camera-dialog.component.html',
})
export class CameraDialogComponent implements OnInit {

    @ViewChild('content')
    content: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CameraDialogComponent>) 
    {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {
        console.log(this.data);
        this.content.nativeElement.append(this.data);
    }

    close() {
        this.dialogRef.close(this.data);
    }

}