import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatSelectChange } from "@angular/material";
import { PredictionService } from "../prediction.service";

@Component({
    selector: 'app-model-selector',
    templateUrl: './model-selector.component.html',
    styles: [`
      :host {
        display: inline-block;
      }
    `]
})
export class ModelSelectorComponent {

    models;
    constructor(
        private $predictionService: PredictionService
    ) {
    }

    ngOnInit() {
        this.$predictionService.getModels().subscribe( data => {
            let models = data.json();
            if (models.length > 0) {
                this.models = Array.from(models);
            }
        })
    }

    onSelected(e: MatSelectChange) {
        this.$predictionService.selectedModel.next(e.value);
    }
}