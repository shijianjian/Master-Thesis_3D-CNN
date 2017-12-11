import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatSidenavModule, MatToolbarModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { CameraGuiService } from './camera-gui.service';
import { SegmentationModule } from './segmentation/segmentation.module';
import { CameraModule } from './camera/camera.module';
import { ControlPanelModule } from './controlPanel/control-panel.module';
import { MainPanelModule } from './mainPanel/main-panel.module';
import { MainViewService } from './main-view.service';
import { NavModule } from './nav/nav.module';

@NgModule({
  declarations: [
    AppComponent
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
    NavModule
  ],
  providers: [
    AppService,
    CameraGuiService,
    MainViewService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
