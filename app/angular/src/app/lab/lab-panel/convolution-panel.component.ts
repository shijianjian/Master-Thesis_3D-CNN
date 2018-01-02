import { Component, Output,EventEmitter } from "@angular/core";
import { MatSelectChange } from "@angular/material";

import { PointCloudCalculations } from "../../common/camera/util/pointcloud-loader";
import { LaboratoryService } from "../laboratory.service";
import { ConvSettings } from "./model/operation-settings";


@Component({
    selector: 'app-convolution-panel',
    templateUrl: 'convolution-panel.component.html'
})
export class ConvolutionPanelComponent {

    @Output() settings = new EventEmitter<ConvSettings>();
    @Output() activate = new EventEmitter<string>();

    convChoice = 1;
    paddingStrategy = ['Same', 'Valid'];

    kernel = [];
    stride = 1;
    padding = this.paddingStrategy[0];

    kernelError;

    convSize: PointCloudCalculations.GridSize = {
        X: 3,
        Y: 3,
        Z: 3
    }

    get kernelConvert() {
        return JSON.stringify(this.kernel, undefined, 4);
    }

    set kernelConvert(stringKernel: string) {
        try{
            this.kernel = Array.from(JSON.parse(stringKernel));
            this.kernelError = undefined;
        } catch(e) {
            this.kernelError = 'Not Valid JSON';
        }
    }

    onPadding(e: MatSelectChange) {
        this.padding = e.value;
    }

    onStart() {
        let settings: ConvSettings = {
            kernel: this.kernel,
            stride: this.stride,
            padding: this.padding
        }
        this.settings.emit(settings);
    }

    onGenerate() {
        this.kernel = this.generate3DKernel(this.convSize, -10, 10);
    }

    private generate3DKernel(convSize: PointCloudCalculations.GridSize, from: number, to: number) {
        let res = [];
        for(let k=0; k<convSize.Z; k++) {
            let y_mat = [];
            for(let j=0 ; j<convSize.Y; j++) {
                let x_mat = [];
                for(let i = 0; i<convSize.X; i++) {
                    x_mat.push(this.random(from,to));
                }
                y_mat.push(x_mat);
            }
            res.push(y_mat);
        }
        return res;
    }

    private random(from: number, to: number) {
        return Math.random()*(to-from) + from;
    }

}