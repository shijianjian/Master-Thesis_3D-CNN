import { Component, OnInit } from '@angular/core';
import { TraningService } from './traning.service';
import { DataPrepSettings } from './model/DataPreprocess';
import { FolderInfo, FolderSelection } from './model/FolderStructure';

@Component({
	selector: 'app-training-page',
	templateUrl: './training-page.component.html',
	styles: [`
	`]
})
export class TrainingPageComponent implements OnInit {

    structure: FolderInfo[] = [];
    selection: FolderSelection;
    dataSettings: DataPrepSettings;
    max;

    devices: string[];
    datasets: string[];

    constructor(private $trainingService: TraningService) { }

    ngOnInit() {
        this.getStructure();
        this.$trainingService.getDataSet().subscribe(data => this.datasets = data.json());
        this.$trainingService.getDevices().subscribe(data => this.devices = data.json());
    }

    getStructure() {
        let sub = this.$trainingService.getFolderStructure().subscribe(
            data => {
                this.structure = data.json();
                this.max = this.getMax(this.structure);
            },
            err => {},
            () => {
                sub.unsubscribe();
            }
        )
    }

    private getMax(fields: FolderInfo[]): number {
        let max = 0;
        fields.forEach(field => {
            if(field.size > max) {
                max = field.size;
            }
        });
        return max;
    }

    onSettings(e: DataPrepSettings) {
        this.dataSettings = e;
    }

    onSelected(e: FolderSelection) {
        this.selection = e;
    }
}