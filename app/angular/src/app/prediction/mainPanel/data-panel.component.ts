import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";
import { MatSliderChange } from "@angular/material";

import { PointCloudPostProcess } from "../../common/camera/util/pointcloud-post-process";

@Component({
	selector: 'app-data-panel',
	templateUrl: './data-panel.component.html',
    styles: [`
        :host {
            display: block;
        }
	`]
})
export class DataPanelComponent implements OnChanges {

    @Input() pointcloud: number[][];
    @Output() outputPoints = new EventEmitter<number[][]>();

    private tempPoints: number[][];

    process: PointCloudPostProcess;

    noise = 0;
    n_std = 1;
    step = 0;

    x_ratio = 0;
    y_ratio = 0;
    z_ratio = 0;

    constructor() {}

    ngOnChanges() {
        this.tempPoints = Array.from(this.pointcloud);
        this.process = new PointCloudPostProcess(this.pointcloud);
    }
    
    reset() {
        this.noise = 0;
        this.n_std = 1;
        this.step = 0;
        
        this.x_ratio = 0;
        this.y_ratio = 0;
        this.z_ratio = 0;

        this.tempPoints = Array.from(this.pointcloud);
    }

    setStep(e: number) {
        this.step = e;
    }
    
    onReshape(e: number) {
        this.tempPoints = this.process.process({
            noise_percentage: this.noise/100,
            noise_variance: this.n_std,
            x_ratio: this.x_ratio,
            y_ratio: this.y_ratio,
            z_ratio: this.z_ratio
        })
        this.outputPoints.emit(this.tempPoints);
    }  
}