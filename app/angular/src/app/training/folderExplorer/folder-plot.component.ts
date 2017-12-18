import { Component, OnChanges, Input, Output, EventEmitter } from "@angular/core";

import * as Plotly from 'plotly.js';
import { FolderInfo } from "../model/FolderStructure";
import { DataPrepSettings } from "../model/DataPreprocess";

@Component({
    selector: 'app-folder-plot',
    templateUrl: './folder-plot.component.html'
})
export class FolderPlotComponent implements OnChanges {

    @Input() selection;
    @Input() structure: FolderInfo[];
    @Input() dataSettings: DataPrepSettings;
    @Input() max:number;
    @Output() augSettings = new EventEmitter<object>();

    ngOnChanges() {
        if (this.structure && this.selection && this.max) {
            let data = this.toPlotlyData(this.structure, this.selection, this.dataSettings ? this.dataSettings.size : this.max);
            if(this.dataSettings && this.dataSettings.augment ? true : false && this.dataSettings.augment.min_value) {
                let data1 = this.toPlotlyData(this.structure, this.selection, this.dataSettings.size, this.dataSettings.augment.min_value, true);
                let layout = {barmode: 'stack'};
                data.name = 'Data';
                data1.name = 'Augmented Data'
                Plotly.newPlot('folder-plot', [data, data1], <any>layout);
            } else {
                Plotly.newPlot('folder-plot', [data]);
            }
        }
    }

    private toPlotlyData(structure: FolderInfo[], selection, sizeLimit?: number, min_value?: number, stacked?: boolean): Plotly.ScatterData {
        let _x = [], _y = [];
        structure.forEach((val, idx, _) => {
            if (selection[val.name] == true) {
                _x.push(val.name);
                if (sizeLimit && sizeLimit < val.size) {
                    let diff = min_value - sizeLimit > 0 ? min_value - sizeLimit : 0;
                    stacked ? _y.push(diff) : _y.push(sizeLimit);
                } else {
                    let diff = min_value - val.size > 0 ? min_value - val.size : 0;
                    stacked ? _y.push(diff) :_y.push(val.size);
                }
            }
        })
        if(stacked) {
            this.augSettings.emit({
                class: _x,
                value: _y
            })
        }
        return ({
            x: _x,
            y: _y,
            type: 'bar'
        } as Plotly.ScatterData)
    }

}