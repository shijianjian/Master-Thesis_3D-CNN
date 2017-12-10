import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

import { VoxelGridLoader } from './util/pointcloud-loader';
import { CameraNativeComponent } from './camera-native.component';
import { CanvasSettings } from '../model/visual-settings';

@Component({
	selector: 'app-camera-featured',
	templateUrl: './camera-featured.component.html',
    styles: [`
        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
        }
	`]
})
export class CameraFeaturedComponent implements OnInit, OnChanges {

    @Input() pointcloud: number[][];
    @Input() canvasSettings: CanvasSettings;
    data: number[][] | number[][][];
    showViewer = true;

    private voxelgrid: number[][][];

    @ViewChild('element')
    private elementRef: ElementRef;
    @ViewChild('parent')
    private parentRef: ElementRef;
    @ViewChild('camera')
    cameraComponent: CameraNativeComponent;

    element: HTMLElement;
    ngOnInit() {
        this.element = this.elementRef.nativeElement;
    }

    ngOnChanges() {
        this.onSelectionChanged({
            index: 0,
            tab: null
        });
    }

    onOutputElement(element: HTMLElement) {
        this.showViewer = true;
        this.setCanvas(element);
        // fire resize camera
        window.dispatchEvent(new Event('resize'));
    }

    onView() {
        this.showViewer = false;
    }

    iconOpacity() {
        if(this.showViewer) {
            return 1;
        } else  {
            return 0;
        }
    }

    setCanvas(element: HTMLElement) {
        this.parentRef.nativeElement.appendChild(element);
    }

    onSelectionChanged(event: MatTabChangeEvent) {
        if (this.pointcloud && event.index == 0) {
            // Point Cloud
            this.data = this.pointcloud
        } else if (this.pointcloud && event.index == 1) {
            // Voxel Grid
            if(!this.voxelgrid) {
                this.voxelgrid = VoxelGridLoader.voxelize(this.pointcloud);
            }
            this.data = this.voxelgrid;
        }
    }
}
