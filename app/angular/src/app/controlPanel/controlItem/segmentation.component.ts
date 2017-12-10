import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';

import { AppService } from '../../app.service';
import { Algorithm, DBSCAN, MeanShift, KMeans } from '../../model/cluster-algorithm';
import { ClusterFormComponent } from './formBuilder/cluster-form.component';

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

    @Output() settings = new EventEmitter<Algorithm.Cluster.Output>();

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

    private get output(): Algorithm.Cluster.Output {
      let settings = {};
      for (let key in this.clusterForm.form.controls) {
        settings[key] = this.clusterForm.form.controls[key].value;
      }
      switch (Algorithm.Cluster.Names[this.selected]) {
        case Algorithm.Cluster.Names.DBSCAN:
          return { 
            name: Algorithm.Cluster.Names.DBSCAN,
            cluster: (settings as DBSCAN.Fields) 
          };
        case Algorithm.Cluster.Names.MEANSHIFT:
          return { 
            name: Algorithm.Cluster.Names.MEANSHIFT,
            cluster: (settings as MeanShift.Fields) 
          };
        case Algorithm.Cluster.Names.KMEANS:
          return { 
            name: Algorithm.Cluster.Names.KMEANS,
            cluster: (settings as KMeans.Fields) 
          };
        default:
          throw TypeError("Not implemented");
      }
    }

    onSegment() {
      this.settings.emit(this.output);
    }

}