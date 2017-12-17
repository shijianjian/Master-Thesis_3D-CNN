import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatTooltipModule, MatExpansionModule, MatInputModule, MatFormFieldModule, MatSliderModule, MatMenuModule, MatProgressSpinnerModule, MatIconModule } from '@angular/material';

import { MainViewComponent } from './main-view.component';
import { CameraModule } from '../../common/camera/camera.module';
import { PredictionComponent } from "./prediction.component";
import { ControlItemModule } from '../controlItem/control-item.module';
import { DataPanelComponent } from './data-panel.component';
import { FormBuilderModule } from '../../common/formbuilder/form-builder.module';

@NgModule({
  declarations: [
    MainViewComponent,
    DataPanelComponent,
    PredictionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSliderModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    CameraModule,
    ControlItemModule,
    FormBuilderModule
  ],
  exports: [
    MainViewComponent
  ],
  providers: [
  ]
})
export class MainPanelModule { }
