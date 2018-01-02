import { Component, Output, EventEmitter } from "@angular/core";
import { MatSelectChange } from "@angular/material";

import { PointCloudCalculations } from "../../common/camera/util/pointcloud-loader";
import { PoolingSettings } from "./model/operation-settings";

@Component({
    selector: 'app-pooling-panel',
    templateUrl: 'pooling-panel.component.html'
})
export class PoolingPanelComponent {

    @Output() settings = new EventEmitter<PoolingSettings>();

    paddingStrategy = ['Same', 'Valid'];

    stride = 1;
    padding = this.paddingStrategy[0];

    poolSize: PointCloudCalculations.GridSize = {
        X: 2,
        Y: 2,
        Z: 2
    }

    onPadding(e: MatSelectChange) {
        this.padding = e.value;
    }

    onStart() {
        let settings: PoolingSettings = {
            size: this.poolSize,
            stride: this.stride,
            padding: this.padding
        }
        this.settings.emit(settings);
    }

}