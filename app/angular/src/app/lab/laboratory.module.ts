import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatSidenavModule, MatButtonModule } from '@angular/material';

import { LaboratoryComponent } from "./laboratory.component";
import { NavModule } from "../common/nav/nav.module";
import { PointCloudUploaderComponent } from '../common/pointcloudUploader/pointcloud-uploader.component';
import { LabViewerModule } from './lab-viewer/lab-viewer.module';
import { LaboratoryService } from './laboratory.service';
import { LabPanelModule } from './lab-panel/lab-panel.module';

@NgModule({
  declarations: [
    LaboratoryComponent
  ],
  imports: [
    BrowserModule,
    NavModule,
    HttpModule,
    MatSidenavModule,
    MatButtonModule,
    LabViewerModule,
    LabPanelModule
  ],
  exports: [
    LaboratoryComponent
  ],
  providers: [
    LaboratoryService
  ]
})
export class LaboratoryModule { }
