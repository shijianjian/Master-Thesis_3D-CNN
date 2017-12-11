import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTabsModule, MatMenuModule, MatProgressSpinnerModule, MatIconModule } from '@angular/material';

import { MainViewComponent } from './main-view.component';
import { CameraModule } from '../camera/camera.module';
import { SegPredictionComponent } from "./seg-prediction.component";
import { ControlItemModule } from '../controlItem/control-item.module';

@NgModule({
  declarations: [
    MainViewComponent,
    SegPredictionComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    CameraModule,
    ControlItemModule
  ],
  exports: [
    MainViewComponent
  ],
  providers: [
  ]
})
export class MainPanelModule { }
