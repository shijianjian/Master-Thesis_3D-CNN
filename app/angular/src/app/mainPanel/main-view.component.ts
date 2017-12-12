import { Component, EventEmitter, Input, OnChanges, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { MatTabChangeEvent, MatMenuTrigger, MatSliderChange } from '@angular/material';

import { VoxelGridLoader } from '../camera/util/pointcloud-loader';
import { CameraNativeComponent } from '../camera/camera-native.component';
import { CanvasSettings } from '../model/visual-settings';
import { MainViewService } from '../main-view.service';
import { PointCloudPostProcess } from '../camera/util/pointcloud-post-process';
import { DataPanelComponent } from './data-panel.component';

@Component({
	selector: 'app-main-view',
	templateUrl: './main-view.component.html',
    styles: [`
        :host {
            display: block;
            position: relative;
            width: 100%;
            padding-left:2em;
        }
	`]
})
export class MainViewComponent implements OnInit, OnChanges {

    @Input() canvasSettings: CanvasSettings;
    @Output() segmented = new EventEmitter<number[][][]>();
    data: number[][] | number[][][];

    origPoints: number[][];
    private pointcloud: number[][];
    private voxelgrid: number[][][];
    currentTab: number;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("form") formCom: DataPanelComponent;

    constructor(private _mainViewService: MainViewService) {}

    ngOnInit() {
        this._mainViewService.pointcloud.subscribe(data => {
            this.origPoints = data;
            this.pointcloud = data;
            this.voxelgrid = undefined;
            this.ngOnChanges();
        })
    }

    ngOnChanges() {
        this.onSelectionChanged({
            index: this.currentTab ? this.currentTab : 0,
            tab: null
        });
        this.formCom ? this.formCom.reset() : null;
    }

    onOutputPoints(e: number[][]) {
        this.pointcloud = e;
        this.voxelgrid = VoxelGridLoader.voxelize(e);
        this.onSelectionChanged({
            index: this.currentTab ? this.currentTab : 0,
            tab: null
        });
    }

    onSegmented(e: JSON) {
		let segs = []
		for (let key in e) {
			segs.push(e[key]);
        }
        this.segmented.emit(segs);
        this.trigger.closeMenu();
    } 

    onSelectionChanged(event: MatTabChangeEvent) {
        this.currentTab = event.index;
        if (this.pointcloud && event.index == 0) {
            // Point Cloud
            this.data = this.pointcloud;
        } else if (this.pointcloud && event.index == 1) {
            // Voxel Grid
            if(!this.voxelgrid) {
                this.voxelgrid = VoxelGridLoader.voxelize(this.pointcloud);
            }
            this.data = this.voxelgrid;
        }
    }

}
