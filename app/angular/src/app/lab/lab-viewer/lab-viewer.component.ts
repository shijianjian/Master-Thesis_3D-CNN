import { Component, OnInit, Input } from '@angular/core';

import { LaboratoryService } from '../laboratory.service';
import { PointCloudFile } from '../../common/pointcloudUploader/model/FileModel';
import { VoxelGridLoader } from '../../common/camera/util/pointcloud-loader';

@Component({
  selector: 'app-lab-viewer',
  templateUrl: './lab-viewer.component.html',
  styleUrls: ['./lab-viewer.component.css']
})
export class LabViewerComponent implements OnInit {

  data: number[][][];
  outputgrid: number[][][];

  constructor(
    private $laboratoryService: LaboratoryService
  ) { 
    $laboratoryService.voxelgrid.subscribe(data =>  this.data = data);
    $laboratoryService.outputgrid.subscribe(data =>  this.outputgrid = data);
  }

  ngOnInit() {
  }

  onLaunch(seg: number[][][]) {
    this.$laboratoryService.voxelgrid.next(seg);
    this.$laboratoryService.outputgrid.next(undefined);
  }
}
