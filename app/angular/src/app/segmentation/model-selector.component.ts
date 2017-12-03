import { Component } from "@angular/core";
import { AppService } from "../app.service";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { MatSelectChange } from "@angular/material";

@Component({
    selector: 'app-model-selector',
    templateUrl: './model-selector.component.html',
    styles: [`
      :host {
        display: inline-block;
      }
    `]
})
export class ModelSelectorComponent implements OnInit {

    models = [];
    selected;

    constructor(private $appService: AppService) {}

    ngOnInit() {
        this.$appService.getModels().subscribe( data => {
            this.models = data.json();
            if (this.models.length > 0) {
                this.onSelected({
                    source: null,
                    value: this.models[0]
                });
            }
        })
    }

    onSelected(e: MatSelectChange) {
        this.selected = e.value;
        this.$appService.selectedModel.next(e.value);
    }
}