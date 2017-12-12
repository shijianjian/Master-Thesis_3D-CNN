import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';

import { AppService } from '../app.service';
import { Cluster, DBSCAN, MeanShift, KMeans } from './model/ClusterModel';
import { MainViewService } from '../main-view.service';
import { FormField } from '../common/formbuilder/model/FormModel';
import { ClusterAlgorithmSettings } from './model/cluster-form-settings';
import { FormBuilderComponent } from '../common/formbuilder/form-builder.component';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class ClusterComponent {

    @Output() segmented = new EventEmitter<JSON>();

    @ViewChild('clusterForm') clusterForm: FormBuilderComponent

    formfields: FormField.FieldModel;
    models: string[];
    selected: string;
    private points: number[][];
    running: boolean = false;

    constructor(
      private $appService: AppService,
      private _mainViewService: MainViewService
    ) {
      this.models = Object.keys(Cluster.Names)
                          .filter(key => typeof Cluster.Names[key] == 'string');
      this._mainViewService.pointcloud.subscribe(data => {
          this.points = data;
      })
    }

    onSelected(e: MatSelectChange) {
      this.selected = Cluster.Names[e.value];
      this.onChangeAlgorithm(Cluster.Names[e.value]);
    }

    onChangeAlgorithm(algorithm: string) {
      let settings: FormField.FieldModel = ClusterAlgorithmSettings.find((value, index, arr)=> {
          if (value.name == algorithm) {
              return true;
          }
      });
      this.formfields = settings;
    }

    private get output(): Cluster.Output {
      let settings = {};
      for (let key in this.clusterForm.form.controls) {
        settings[key] = this.clusterForm.form.controls[key].value;
      }
      switch (Cluster.Names[this.selected]) {
        case Cluster.Names.DBSCAN:
          return { 
            name: Cluster.Names.DBSCAN,
            cluster: (settings as DBSCAN.Fields) 
          };
        case Cluster.Names.MEANSHIFT:
          return { 
            name: Cluster.Names.MEANSHIFT,
            cluster: (settings as MeanShift.Fields) 
          };
        case Cluster.Names.KMEANS:
          return { 
            name: Cluster.Names.KMEANS,
            cluster: (settings as KMeans.Fields) 
          };
        default:
          throw TypeError("Not implemented");
      }
    }

    onSegment() {
      this.running = true;
      this.$appService.getClusters(this.points, this.output).subscribe(
        data => {
          let dict: JSON = data.json();
          this.segmented.emit(dict);
        },
        error => {
          this.running = false;
        },
        () => {
          this.running = false;
        }
      )
    }

}