import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';

import { AppService } from '../app.service';
import { Algorithm, DBSCAN, MeanShift, KMeans } from '../model/cluster-algorithm';
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

    @Output() segments = new EventEmitter<JSON>();

    @ViewChild('clusterForm') clusterForm: ClusterFormComponent

    models: string[];
    selected: string;

    constructor(
      private $appService: AppService
    ) {
      this.models = Object.keys(Algorithm.Cluster.Names)
                          .filter(key => typeof Algorithm.Cluster.Names[key] == 'string');
    }

    onSelected(e: MatSelectChange) {
      this.selected = Algorithm.Cluster.Names[e.value];
      this.clusterForm.onChangeAlgorithm(Algorithm.Cluster.Names[e.value]);
    }

    private get settings(): Algorithm.Cluster.Output {
      let settings = {};
      for (let key in this.clusterForm.form.controls) {
        settings[key] = this.clusterForm.form.controls[key].value;
      }
      switch (Algorithm.Cluster.Names[this.selected]) {
        case Algorithm.Cluster.Names.DBSCAN:
          return { cluster: (settings as DBSCAN.Fields) };
        case Algorithm.Cluster.Names.MEANSHIFT:
          return { cluster: (settings as MeanShift.Fields) };
        case Algorithm.Cluster.Names.KMEANS:
          return { cluster: (settings as KMeans.Fields) };
        default:
          throw TypeError("Not implemented");
      }
    }

    segment() {
      let settings = this.settings;
      this.$appService.getClusters(this.pointcloud, settings, Algorithm.Cluster.Names[this.selected]).subscribe(data => {
          let dict: JSON = data.json();
          this.segments.emit(dict);
        }
      )
    }

}