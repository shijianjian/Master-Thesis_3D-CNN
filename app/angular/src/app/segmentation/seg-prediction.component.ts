import { Component, Input, Output, EventEmitter} from '@angular/core';
import { PointsSettings } from '../model/points-settings';

import { AppService } from '../app.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-seg-prediction',
  templateUrl: './seg-prediction.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class SegPredictionComponent implements OnInit {

    @Input() seg: PointsSettings;
    @Output() prediction = new EventEmitter<string>();
    running: boolean = false;
    private model: string;

    constructor(private $appService: AppService) {}

    ngOnInit() {
      this.$appService.selectedModel.subscribe(model => this.model = model)
    }
    
    predict(points: number[][]) {
        this.running = true;
        this.$appService.predict(points, this.model).subscribe((data) => {
            this.prediction.emit(data.json());
            this.running = false;
        })
    }

}