import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";

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
    @Input() files = ['No Existing File'];

    @Output() settings = new EventEmitter<DataPrepSettings>();

    radio = 1;
    use_all = true;
    use_aug = false;

    augSettings: DataAugmentation.Settings;
    data_size = 0;

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
            augment: this._augment
        })
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