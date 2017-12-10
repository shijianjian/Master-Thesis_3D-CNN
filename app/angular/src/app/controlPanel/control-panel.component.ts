import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { AppService } from "../app.service";
import { Algorithm } from "../model/cluster-algorithm";

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
    opened = false;
    models = [];

    @Output() pointcloud = new EventEmitter<number[][]>();
    @Output() segments = new EventEmitter<JSON>();
    points: number[][];

    constructor(private $appService: AppService) {

    }

    ngOnInit() {
        this.$appService.getModels().subscribe( data => {
            let models = data.json();
            if (models.length > 0) {
                this.models = Array.from(models);
            }
        })
    }

    onUploaded(e: number[][]) {
        this.points = e;
        this.pointcloud.emit(e);
    }

    onSelected(e: string) {
        this.$appService.selectedModel.next(e);
    }

    onBackdropClick(e){
        console.log(e);
    }
    onSegments(event: Algorithm.Cluster.Output) {
      this.$appService.getClusters(this.points, event).subscribe(data => {
          let dict: JSON = data.json();
          this.segments.emit(dict);
        }
      )
    }
}