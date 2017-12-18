import { Component, Input, OnChanges, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { FolderInfo } from "../model/FolderStructure";
import { DataPrepSettings } from "../model/DataPreprocess";
import { TrainingSettingsComponent } from "./training-settings.component";

@Component({
    selector: 'app-training-panel',
    templateUrl: 'training-panel.component.html',
    styles: [`
    :host {
        display: block;
    }
    `]
})
export class TrainingPanelComponent implements OnChanges {

    @Input() selection;
    @Input() structure: FolderInfo[];
    @Input() max: number;
    @Input() augSettings: object;

    @Output() settings = new EventEmitter<DataPrepSettings>();
    dataSettings: DataPrepSettings;
    @ViewChild('trainingSettingsEle') element: TrainingSettingsComponent;

    hdf5Form: FormGroup = new FormGroup({});
    trainingSettingForm: FormGroup = new FormGroup({});
    devices = ['/cpu:0'];

    ngOnChanges() {

    }

    onSettings(e: DataPrepSettings) {
        this.dataSettings = e;
        this.settings.emit(e);
    }
    
    onStart() {
        console.log(this.element.onSettings())
        console.log(this.dataSettings);
        console.log(this.augSettings);
    }


}