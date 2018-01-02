import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatTabsModule, 
         MatSelectModule, MatRadioModule } from "@angular/material";

import { LabPanelComponent } from "./lab-panel.component";
import { PointCloudUploaderModule } from "../../common/pointcloudUploader/pointcloud-uploader.module";
import { PoolingPanelComponent } from "./pooling-panel.component";
import { ConvolutionPanelComponent } from "./convolution-panel.component";
import { ActivationPanelComponent } from "./activation-panel.component";

@NgModule({
    declarations: [
        LabPanelComponent,
        PoolingPanelComponent,
        ConvolutionPanelComponent,
        ActivationPanelComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule, 
        MatInputModule, 
        MatTabsModule,
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        PointCloudUploaderModule
    ],
    exports: [
        LabPanelComponent
    ]
})
export class LabPanelModule {

}