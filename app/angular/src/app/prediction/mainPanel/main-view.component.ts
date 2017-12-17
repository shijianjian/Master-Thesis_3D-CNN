import { Component, EventEmitter, Input, OnChanges, OnInit, ViewChild, ElementRef, Output, HostBinding } from '@angular/core';
import { MatTabChangeEvent, MatMenuTrigger, MatSliderChange } from '@angular/material';

import { VoxelGridLoader, PointCloudLoader } from '../../common/camera/util/pointcloud-loader';
import { CameraNativeComponent } from '../../common/camera/camera-native.component';
import { CanvasSettings } from '../../common/camera/model/visual-settings';
import { PointCloudPostProcess } from '../../common/camera/util/pointcloud-post-process';
import { DataPanelComponent } from './data-panel.component';
import { DatGuiService } from '../../common/camera/dat-gui.service';
import { PredictionService } from '../prediction.service';

@Component({
	selector: 'app-main-view',
	templateUrl: './main-view.component.html',
    styles: [`
        :host {
            display: block;
            position: relative;
            width: 100%;
        }
        .small-gap {
            margin-left:3px;
        }
        .big-gap {
            margin-left:3px;
            margin-right: 7px;
        }
	`]
})
export class MainViewComponent implements OnInit, OnChanges {

    @HostBinding('class.container') binding: boolean = true;

    @Input() canvasSettings: CanvasSettings;
    @Output() segmented = new EventEmitter<number[][][]>();
    data: number[][] | number[][][];

    origPoints: number[][];
    pointcloud: number[][];
    private voxelgrid: number[][][];
    currentTab: number;

    prediction: string;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("form") formCom: DataPanelComponent;

    constructor(
        private $predictionService: PredictionService,
        private $datGui: DatGuiService
    ) {}

    ngOnInit() {
        this.$predictionService.pointcloud.subscribe(data => {
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
        this.prediction = undefined;
    }

    onReset() {
        this.onOutputPoints(Array.from(this.origPoints));
        this.$datGui.setControlParams({
            size: PointCloudLoader.DefaultPointsParams.size,
            opacity: PointCloudLoader.DefaultPointsParams.opacity,
            wireframe: VoxelGridLoader.DefaultVoxelParams.wireframe
        });
    }

    onOutputPoints(e: number[][]) {
        this.pointcloud = e;
        this.voxelgrid = VoxelGridLoader.voxelize(e);
        this.onSelectionChanged({
            index: this.currentTab ? this.currentTab : 0,
            tab: null
        });
    }

    onPrediction(e: string) {
        this.prediction = e;
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
