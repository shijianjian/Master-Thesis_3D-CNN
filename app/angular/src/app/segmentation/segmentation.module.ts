import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatPaginatorModule, MatIconModule } from '@angular/material';

import { SegmentationListComponent } from "./segmentation-list.component";
import { CameraModule } from "../camera/camera.module";

@NgModule({
    declarations: [
      SegmentationListComponent
    ],
    imports: [
      BrowserModule,
      MatIconModule,
      MatPaginatorModule,
      CameraModule
    ],
    exports: [
        SegmentationListComponent
    ],
    providers: [
    ]
  })
  export class SegmentationModule {

  }