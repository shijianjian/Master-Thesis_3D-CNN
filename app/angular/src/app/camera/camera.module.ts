import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CameraComponent } from './camera.component';

@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    CameraComponent
  ],
  providers: [
  ]
})
export class CameraModule { }
