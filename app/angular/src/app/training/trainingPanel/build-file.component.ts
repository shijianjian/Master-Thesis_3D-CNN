import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { MatCheckboxChange, MatSelectChange } from "@angular/material";

import { FolderInfo } from "../model/FolderStructure";
import { DataPrepSettings, DataAugmentation } from "../model/DataPreprocess";

@Component({
    selector: 'app-build-file',
    templateUrl: 'build-file.component.html',
    styles: [`
    :host {
        display: block;
    }
    `]
})
export class BuildFileComponent implements OnChanges {

    @Input() max: number;
    @Input() min: number;
    @Input() datasets = ['No Existing File'];

    @Output() settings = new EventEmitter<DataPrepSettings>();

    radio = 1;
    use_all = true;
    use_aug = false;
    filename;

    augSettings: DataAugmentation.Settings;
    data_size = 0;

    selected_file;
    
    ngOnChanges() {

    }

    onUseAll(e: MatCheckboxChange) {
        this.use_all = e.checked;
        if (e.checked) {
            this.onEnter();
        }
    }

    onAugSettings(e: DataAugmentation.Settings) {
        this.augSettings = e;
        this.onEnter();
    }

    onEnter() {
        this.settings.emit({
            size: this.use_all ? this.max : this.data_size,
            filename: this.filename,
            augment: this._augment
        })
    }

    onSelected(e: MatSelectChange) {
        this.selected_file = e.value;
    }

    get result(): DataPrepSettings | string {
        if (this.radio == 1) {
            return {
                size: this.use_all ? this.max : this.data_size,
                filename: this.filename,
                augment: this._augment
            }
        }
        if (this.radio == 2) {
            return this.selected_file;
        }
    }

    private get _augment() {
        if(this.use_aug) {
            if(this.augSettings 
                && (this.augSettings.noise.enabled == true
                || this.augSettings.rotate.enabled == true
                || this.augSettings.squeeze.enabled == true)
            ) {
                return this.augSettings;
            }
        }
        return undefined;
    }

}