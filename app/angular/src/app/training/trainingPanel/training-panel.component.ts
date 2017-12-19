import { Component, Input, OnChanges, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { FolderInfo, FolderSelection } from "../model/FolderStructure";
import { DataPrepSettings } from "../model/DataPreprocess";
import { TrainingSettingsComponent } from "./training-settings.component";
import { BuildFileComponent } from "./build-file.component";
import { TraningService } from "../traning.service";

@Component({
    selector: 'app-training-panel',
    templateUrl: 'training-panel.component.html',
    styles: [`
    :host {
        display: block;
    }
    `]
})
export class TrainingPanelComponent {

    @Input() selection: FolderSelection;
    @Input() structure: FolderInfo[];
    @Input() max: number;
    @Input() datasets: string[];
    @Input() devices: string[];
    @Output() settings = new EventEmitter<DataPrepSettings>();
    dataSettings: DataPrepSettings;
    @ViewChild('trainingSettingsEle') element: TrainingSettingsComponent;
    @ViewChild('buildfile') buildfileelement: BuildFileComponent;

    hdf5Form: FormGroup = new FormGroup({});
    trainingSettingForm: FormGroup = new FormGroup({});

    constructor(private $trainingService: TraningService) {}

    onSettings(e: DataPrepSettings) {
        this.dataSettings = e;
        this.settings.emit(e);
    }
    
    onStart() {
        if (typeof this.buildfileelement.result == 'string') {
            this.$trainingService.training(this.buildfileelement.result, this.element.onSettings()).subscribe(data => {
                console.log(data.json())
            })
        } else {
            let input: DataPrepSettings = Object.assign({}, this.buildfileelement.result)
            input.min_filter = this.selection.min_value;
            input.max_filter = this.selection.max_value;
            this.$trainingService.buildH5File(input).subscribe(data => {
                console.log(data.json())
            })
        }
        console.log(this.element.onSettings())
        console.log(this.buildfileelement.result);
        console.log(this.selection);
    }


}