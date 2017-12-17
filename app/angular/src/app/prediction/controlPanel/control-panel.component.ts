import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { PredictionService } from "../prediction.service";
import { Cluster } from "../controlItem/model/ClusterModel";

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styles: [`
        :host {
            display: inline-block;
        }

        .control-panel {
            padding: 5px;
            width: 100%;
            height:100%;
            margin-bottom: 10px;
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        }
    `]
})
export class ControlPanelComponent implements OnInit {

    models = [];

    @Output() segments = new EventEmitter<JSON>();
    points: number[][];

    constructor(
        private $predictionService: PredictionService
    ) {
        this.$predictionService.pointcloud.subscribe(data => {
            this.points = data;
        })
    }

    ngOnInit() {
        this.$predictionService.getModels().subscribe( data => {
            let models = data.json();
            if (models.length > 0) {
                this.models = Array.from(models);
            }
        })
    }

    onSelected(e: string) {
        this.$predictionService.selectedModel.next(e);
    }

    onBackdropClick(e){
        console.log(e);
    }

    onSegments(event: Cluster.Output) {
      this.$predictionService.getClusters(this.points, event).subscribe(data => {
          let dict: JSON = data.json();
          this.segments.emit(dict);
        }
      )
    }
}