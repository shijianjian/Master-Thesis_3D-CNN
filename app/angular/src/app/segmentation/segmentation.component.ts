import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';

import { AppService } from '../app.service';
import { PointsSettings } from '../model/points-settings';
import { ClusterAlgorithms, ClusterSettings, DBSCANAlgorithm, DBSCAN, MeanShift } from '../model/cluster-algorithm';
import { ClusterFormComponent } from './clusters/cluster-form.component';

@Component({
  selector: 'app-segmentation',
  templateUrl: './segmentation.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class SegmentationComponent {

    @Input() pointcloud: number[][];
    @Input() filename: string;

    @Output() segments = new EventEmitter<PointsSettings[]>();

    @ViewChild('clusterForm') clusterForm: ClusterFormComponent

    models: string[];
    selected: string;

    constructor(
      private $appService: AppService
    ) {
      this.models = Object.keys(ClusterAlgorithms).filter(key => typeof ClusterAlgorithms[key] == 'string');
    }

    onSelected(e: MatSelectChange) {
      this.selected = ClusterAlgorithms[e.value];
      this.clusterForm.onChangeAlgorithm(ClusterAlgorithms[e.value]);
    }

    private get settings(): ClusterSettings {
      let settings = {};
      for (let key in this.clusterForm.form.controls) {
        settings[key] = this.clusterForm.form.controls[key].value;
      }
      switch (ClusterAlgorithms[this.selected]) {
        case ClusterAlgorithms.DBSCAN:
          return { cluster: (settings as DBSCAN) };
        case ClusterAlgorithms.MEANSHIFT:
          return { cluster: (settings as MeanShift) }
      }
    }

    segment() {
      let settings = this.settings;
      this.$appService.getClusters(this.pointcloud, settings, ClusterAlgorithms[this.selected]).subscribe(data => {
          let segs: PointsSettings[] = [];
          let dict = data.json();
          for(let key in dict) {
            this.$appService.getCameraSettings(dict[key], `${this.filename}_${key}`, 32).subscribe(
              csetting => {
                segs.push({
                  points: dict[key],
                  camera: csetting
                })
                if (Object.keys(dict).length == segs.length) {
                  this.segments.emit(segs);
                }
              }
            )
          }
        }
      )
    }

}