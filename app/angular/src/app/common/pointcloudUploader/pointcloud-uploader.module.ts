import { FileUploadModule } from 'ng2-file-upload';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PointCloudUploaderComponent } from './pointcloud-uploader.component';

@NgModule({
    declarations: [
        PointCloudUploaderComponent
    ],
    imports: [
      BrowserModule,
      FileUploadModule
    ],
    exports: [
        PointCloudUploaderComponent
    ]
  })
  export class PointCloudUploaderModule { }