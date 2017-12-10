import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';

import { ModelSelectorComponent } from './model-selector.component';
import { ClusterAlgorithmModule } from './formBuilder/cluster-algorithm.module'
import { SegmentationComponent } from './segmentation.component';
import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
  declarations: [
    ModelSelectorComponent,
    SegmentationComponent,
    FileUploaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    FileUploadModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSelectModule,
    ClusterAlgorithmModule
  ],
  exports: [
    ModelSelectorComponent,
    SegmentationComponent,
    FileUploaderComponent
  ],
  providers: [
  ]
})
export class ControlItemModule { }
