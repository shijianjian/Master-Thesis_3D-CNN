import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';

import { ModelSelectorComponent } from './model-selector.component';
import { ClusterComponent } from './cluster.component';
import { FormBuilderModule } from '../../common/formbuilder/form-builder.module';

@NgModule({
  declarations: [
    ModelSelectorComponent,
    ClusterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule, 
    MatInputModule,
    MatProgressSpinnerModule,
    FormBuilderModule
  ],
  exports: [
    ModelSelectorComponent,
    ClusterComponent
  ],
  providers: [
  ]
})
export class ControlItemModule { }
