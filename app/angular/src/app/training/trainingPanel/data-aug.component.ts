import { Component, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";

import { FolderInfo } from "../model/FolderStructure";
import { DataAugmentation } from "../model/DataPreprocess";

@Component({
    selector: 'app-data-aug',
    templateUrl: 'data-aug.component.html',
    styles: [`
    :host {
        display: block;
    }
    mat-checkbox {
        display: block;
    }
    `]
})
export class DataAugmentationComponent implements OnChanges {

    @Output() augSettings = new EventEmitter<DataAugmentation.Settings>();

    min_value = 0;
    settings: DataAugmentation.Settings = {
        noise  : { enabled: false },
        squeeze: { enabled: false },
        rotate : { enabled: false },
        min_value: this.min_value
    }

    ngOnChanges() {

    }

    emit() {
        this.settings.min_value = this.min_value;
        this.augSettings.emit(Object.assign({}, this.settings));
    }

    onChange(e: MatCheckboxChange, n: number) {
        if (n == 1) {
            this.settings.noise.enabled = e.checked;
        }
        if (n == 2) {
            this.settings.squeeze.enabled = e.checked;
        }
        if (n == 3) {
            this.settings.rotate.enabled = e.checked;
        }
        this.emit();
    }

}