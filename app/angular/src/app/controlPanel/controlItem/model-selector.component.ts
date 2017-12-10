import { Component, Input, Output, EventEmitter } from "@angular/core";
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
export class ModelSelectorComponent {

    @Input() models;
    @Output() selected = new EventEmitter<any>();

    onSelected(e: MatSelectChange) {
        this.selected.emit(e.value);
    }
}