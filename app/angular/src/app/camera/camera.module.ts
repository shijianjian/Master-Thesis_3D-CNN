import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { CameraComponent } from './camera.component';

@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule
  ],
  exports: [
    CameraComponent
  ],
  providers: [
  ]
})
export class CameraModule { }
