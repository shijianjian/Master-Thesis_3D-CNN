import { Component, OnChanges, Input } from "@angular/core";

import * as Plotly from 'plotly.js';
import { FolderInfo } from "../model/FolderStructure";

@Component({
    selector: 'app-folder-plot',
    templateUrl: './folder-plot.component.html'
})
export class FolderPlotComponent implements OnChanges {

    @Input() selection;
    @Input() structure: FolderInfo[];
    @Input() selectedSize: number;
    @Input() useDataAug: boolean;

    ngOnChanges() {
        if (this.structure && this.selection) {
            let data = this.toPlotlyData(this.structure, this.selection, this.selectedSize);
            if(this.useDataAug) {
                let data1 = this.toPlotlyData(this.structure, this.selection, this.selectedSize, true);
                let layout = {barmode: 'stack'};
                data.name = 'Data';
                data1.name = 'Augmented Data'
                Plotly.newPlot('folder-plot', [data, data1], <any>layout);
            } else {
                Plotly.newPlot('folder-plot', [data]);
            }
        }
    }

    private toPlotlyData(structure: FolderInfo[], selection, sizeLimit?: number, stacked?: boolean): Plotly.ScatterData {
        let _x = [], _y = [];
        structure.forEach((val, idx, _) => {
            if (selection[val.name] == true) {
                _x.push(val.name);
                if (sizeLimit && sizeLimit < val.size) {
                    stacked ? _y.push(0) : _y.push(sizeLimit);
                } else {
                    stacked ? _y.push(sizeLimit - val.size) :_y.push(val.size);
                }
            }
        })
        return ({
            x: _x,
            y: _y,
            type: 'bar'
        } as Plotly.ScatterData)
    }

}