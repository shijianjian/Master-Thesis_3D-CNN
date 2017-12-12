import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatSelectChange } from "@angular/material";
import { AppService } from "../app.service";

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
        private $appService: AppService
    ) {
    }

    ngOnInit() {
        this.$appService.getModels().subscribe( data => {
            let models = data.json();
            if (models.length > 0) {
                this.models = Array.from(models);
            }
        })
    }

    onSelected(e: MatSelectChange) {
        this.$appService.selectedModel.next(e.value);
    }
}