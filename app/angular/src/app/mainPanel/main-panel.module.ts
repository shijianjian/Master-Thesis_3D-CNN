import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatExpansionModule, MatInputModule, MatFormFieldModule, MatSliderModule, MatMenuModule, MatProgressSpinnerModule, MatIconModule } from '@angular/material';

import { MainViewComponent } from './main-view.component';
import { CameraModule } from '../camera/camera.module';
import { SegPredictionComponent } from "./seg-prediction.component";
import { ControlItemModule } from '../controlItem/control-item.module';
import { DataPanelComponent } from './data-panel.component';
import { CommonsModule } from '../common/commons.module';

@NgModule({
  declarations: [
    MainViewComponent,
    DataPanelComponent,
    SegPredictionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSliderModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    CameraModule,
    ControlItemModule,
    CommonsModule
  ],
  exports: [
    MainViewComponent
  ],
  providers: [
  ]
})
export class MainPanelModule { }
