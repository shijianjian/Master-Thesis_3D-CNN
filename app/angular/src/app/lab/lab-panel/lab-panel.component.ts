import { Component } from "@angular/core";

import { LaboratoryService } from "../laboratory.service";
import { PointCloudFile } from "../../common/pointcloudUploader/model/FileModel";
import { VoxelGridLoader } from "../../common/camera/util/pointcloud-loader";
import { ConvSettings, PoolingSettings } from "./model/operation-settings";

@Component({
    selector: 'app-lab-panel',
    templateUrl: './lab-panel.component.html'
})
export class LabPanelComponent {

    voxelSize = 32;
    data: number[][];
    filename: string;

    constructor(
        private $laboratoryService: LaboratoryService
    ) {
        this.$laboratoryService.pointcloud.subscribe(data => {
            this.data = data;
        })
    }

    onConv(e: ConvSettings) {
        let voxel = this.$laboratoryService.voxelgrid.getValue();
        this.$laboratoryService.conv3d(voxel, e.kernel, e.stride, e.padding).subscribe(data => {
            this.$laboratoryService.outputgrid.next(data.json());
        });
    }

    onActivate(e: string) {
        if (e === 'ReLU') {
            let voxel = this.$laboratoryService.voxelgrid.getValue();
            let newVoxel = Array.from(voxel);
            for(let i=0; i<voxel.length; i++) {
                for(let j=0; j<voxel[i].length; j++) {
                    for(let k=0; k<voxel[i][j].length; k++) {
                        if(newVoxel[i][j][k]<0) {
                            newVoxel[i][j][k]=0;
                        }
                    }
                }
            }
            this.$laboratoryService.outputgrid.next(newVoxel);
        }
    }

    onPool(e: PoolingSettings) {
        let voxel = this.$laboratoryService.voxelgrid.getValue();
        this.$laboratoryService.pool3d(voxel, e.size, e.stride, e.padding).subscribe(data => {
            this.$laboratoryService.outputgrid.next(data.json());
        });
    }

    onUploaded(e: PointCloudFile) {
        this.$laboratoryService.pointcloud.next(e.points);
        this.filename = e.filename;
    }

    generate() {
        let voxel = VoxelGridLoader.voxelize(this.data, {
            X: this.voxelSize,
            Y: this.voxelSize,
            Z: this.voxelSize
        });
        this.$laboratoryService.voxelgrid.next(voxel);
    }
}