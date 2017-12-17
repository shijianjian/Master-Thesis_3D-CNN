import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { NavModule } from "../../common/nav/nav.module";
import { PredictionNavComponent } from './prediction-nav.component';
import { ControlItemModule } from '../controlItem/control-item.module';
import { PointCloudUploaderModule } from '../../common/pointcloudUploader/pointcloud-uploader.module';

@NgModule({
  declarations: [
    PredictionNavComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    PointCloudUploaderModule,
    NavModule
  ],
  exports: [
    PredictionNavComponent
  ],
  providers: [
  ]
})
export class PredictionNavModule { }
