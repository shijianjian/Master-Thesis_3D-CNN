import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatSidenavModule, MatToolbarModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { PredictionService } from './prediction.service';
import { SegmentationModule } from './segmentation/segmentation.module';
import { CameraModule } from '../common/camera/camera.module';
import { ControlPanelModule } from './controlPanel/control-panel.module';
import { MainPanelModule } from './mainPanel/main-panel.module';
import { PredictionNavModule } from './nav/prediction-nav.module';
import { PredictionPageComponent } from './prediction-page.component';

@NgModule({
  declarations: [
    PredictionPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MainPanelModule,
    SegmentationModule,
    ControlPanelModule,
    PredictionNavModule
  ],
  providers: [
    PredictionService
  ]
})
export class PredictionPageModule { }
