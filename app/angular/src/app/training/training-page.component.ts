import { Component, OnInit } from '@angular/core';
import { TraningService } from './traning.service';
import { DataPrepSettings } from './model/DataPreprocess';
import { FolderInfo } from './model/FolderStructure';

@Component({
	selector: 'app-training-page',
	templateUrl: './training-page.component.html',
	styles: [`
	`]
})
export class TrainingPageComponent implements OnInit {

    structure: FolderInfo[] = [];
    selection = {};
    dataSettings: DataPrepSettings;
    augSettings: object;
    max;

    constructor(private $trainingService: TraningService) { }

    ngOnInit() {
        this.getStructure();
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

    onAugSettings(e: object) {
        this.augSettings = e;
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

    onSelected(e) {
        this.selection = e;
    }
}