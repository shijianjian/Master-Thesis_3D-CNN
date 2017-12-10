import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTabsModule, MatDialogModule, MatIconModule } from '@angular/material';

import { CameraNativeComponent } from './camera-native.component';
import { CameraFeaturedComponent } from './camera-featured.component';
import { CameraDialogComponent } from './camera-dialog.componnet';
import { CameraDialogViewerComponent } from './camera-dialog-viewer.component';

@NgModule({
  declarations: [
    CameraNativeComponent,
    CameraFeaturedComponent,
    CameraDialogComponent,
    CameraDialogViewerComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [
    CameraFeaturedComponent
  ],
  entryComponents: [
    CameraDialogComponent
  ],
  providers: [
  ]
})
export class CameraModule { }
