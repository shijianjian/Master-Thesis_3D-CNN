import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { PointCloudFile } from '../../common/pointcloudUploader/model/FileModel';
import { DatGuiService } from '../../common/camera/dat-gui.service';
import { PointCloudLoader, VoxelGridLoader } from '../../common/camera/util/pointcloud-loader';
import { PredictionService } from '../prediction.service';


@Component({
  selector: 'app-prediction-nav',
  templateUrl: './prediction-nav.component.html'
})
export class PredictionNavComponent {

    @Input() showMenu: boolean = false;
    points: number[][];

    @Output() menuToggle = new EventEmitter<boolean>();

    constructor(
        private $predictionService: PredictionService,
        private $datGui: DatGuiService
    ) {}

    onMenu() {
        this.menuToggle.emit(true);
    }

    onUploaded(e: PointCloudFile) {
        this.$predictionService.pointcloud.next(e.points);
        this.points = e.points;
        this.$datGui.openGui();
    }

    onReload() {
        this.$predictionService.pointcloud.next(Array.from(this.points));
        this.$datGui.setControlParams({
            size: PointCloudLoader.DefaultPointsParams.size,
            opacity: PointCloudLoader.DefaultPointsParams.opacity,
            wireframe: VoxelGridLoader.DefaultVoxelParams.wireframe
        });
    }

}