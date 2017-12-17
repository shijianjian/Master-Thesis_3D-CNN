import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatDialogModule, MatIconModule, MatSliderModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { CameraNativeComponent } from './camera-native.component';
import { CameraDialogComponent } from './camera-dialog.componnet';
import { CameraDialogViewerComponent } from './camera-dialog-viewer.component';
import { CameraPanelComponent } from './camera-panel.component';
import { DatGuiService } from './dat-gui.service';

@NgModule({
  declarations: [
    CameraNativeComponent,
    CameraPanelComponent,
    CameraDialogComponent,
    CameraDialogViewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [
    CameraPanelComponent,
    CameraNativeComponent
  ],
  entryComponents: [
    CameraDialogComponent
  ],
  providers: [
    DatGuiService
  ]
})
export class CameraModule { }
