import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { CameraNativeComponent } from './camera-native.component';

@NgModule({
  declarations: [
    CameraNativeComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule
  ],
  exports: [
    CameraNativeComponent
  ],
  providers: [
  ]
})
export class CameraModule { }
