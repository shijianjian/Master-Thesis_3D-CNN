import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatPaginatorModule, MatTooltipModule, MatIconModule } from '@angular/material';

import { SegmentationListComponent } from "./segmentation-list.component";
import { CameraModule } from "../../common/camera/camera.module";

@NgModule({
    declarations: [
      SegmentationListComponent
    ],
    imports: [
      BrowserModule,
      MatIconModule,
      MatPaginatorModule,
      MatTooltipModule,
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