import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';

import { ModelSelectorComponent } from './model-selector.component';
import { ClusterComponent } from './cluster.component';
import { FileUploaderComponent } from './file-uploader.component';
import { CommonsModule } from '../../common/commons.module';

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
    MatSelectModule,
    MatFormFieldModule, 
    MatInputModule,
    MatProgressSpinnerModule,
    CommonsModule
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
