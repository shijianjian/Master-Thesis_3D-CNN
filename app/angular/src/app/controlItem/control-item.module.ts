import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule, MatCheckboxModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';

import { ModelSelectorComponent } from './model-selector.component';
import { ClusterAlgorithmModule } from './formBuilder/cluster-algorithm.module'
import { ClusterComponent } from './cluster.component';
import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
  declarations: [
    ModelSelectorComponent,
    ClusterComponent,
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
    MatProgressSpinnerModule,
    ClusterAlgorithmModule
  ],
  exports: [
    ModelSelectorComponent,
    ClusterComponent,
    FileUploaderComponent
  ],
  providers: [
  ]
})
export class ControlItemModule { }
