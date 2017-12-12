import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { AppService } from '../app.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class PredictionComponent implements OnInit {

    @Input() points: number[][];
    @Output() prediction = new EventEmitter<string>();
    running: boolean = false;
    result: string;
    disableBtn: boolean = true;

    private model: string;

    constructor(private $appService: AppService) {}

    ngOnInit() {
      this.$appService.selectedModel.subscribe(model => {
        if (model == null || typeof model == 'undefined') {
          this.disableBtn = true;
        } else {
          this.disableBtn = false;
        }
        this.model = model;
      })
    }
    
    predict() {
        this.running = true;
        this.$appService.predict(this.points, this.model).subscribe((data) => {
            this.result = data.json();
            this.prediction.emit(this.result);
            this.running = false;
        })
    }

}