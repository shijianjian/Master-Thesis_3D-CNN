import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { CameraComponent } from './camera.component';
import { CameraNativeComponent } from './camera-native.component';

@NgModule({
  declarations: [
    CameraComponent,
    CameraNativeComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule
  ],
  exports: [
    CameraComponent,
    CameraNativeComponent
  ],
  providers: [
  ]
})
export class CameraModule { }
