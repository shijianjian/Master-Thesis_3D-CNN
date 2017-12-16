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

    ngOnChanges() {
        if (this.structure && this.selection) {
            const data = this.toPlotlyData(this.structure, this.selection);
            Plotly.newPlot('folder-plot', [data]);
        }
    }

    private toPlotlyData(structure: FolderInfo[], selection): Plotly.ScatterData {
        let _x = [], _y = [];
        structure.forEach((val, idx, _) => {
            if (selection[val.name] == true) {
                _x.push(val.name);
                _y.push(val.size);
            }
        })
        return ({
            x: _x,
            y: _y,
            type: 'bar'
        } as Plotly.ScatterData)
    }

}