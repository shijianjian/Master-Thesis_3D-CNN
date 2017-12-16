import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

import { VoxelGridLoader } from './util/pointcloud-loader';
import { CameraNativeComponent } from './camera-native.component';
import { CanvasSettings } from '../model/visual-settings';

@Component({
	selector: 'app-camera-panel',
	templateUrl: './camera-panel.component.html',
    styles: [`
        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
        }
	`]
})
export class CameraPanelComponent implements OnInit, OnChanges {

    @Input() pointcloud: number[][];
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
        this.data = this.pointcloud;
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

}
