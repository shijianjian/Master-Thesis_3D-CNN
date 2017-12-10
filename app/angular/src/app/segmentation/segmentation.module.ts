import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SegmentationListComponent } from "./segmentation-list.component";
import { CameraModule } from "../camera/camera.module";
import { SegPredictionComponent } from "./seg-prediction.component";

@NgModule({
    declarations: [
      SegmentationListComponent,
      SegPredictionComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatSelectModule,
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