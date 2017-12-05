import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SegmentationComponent } from "./segmentation.component";
import { SegmentationListComponent } from "./segmentation-list.component";
import { CameraModule } from "../camera/camera.module";
import { SegPredictionComponent } from "./seg-prediction.component";
import { ModelSelectorComponent } from "./model-selector.component";
import { ClusterAlgorithmModule } from "./clusters/cluster-algorithm.module";

@NgModule({
    declarations: [
      SegmentationComponent,
      SegmentationListComponent,
      SegPredictionComponent,
      ModelSelectorComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      ClusterAlgorithmModule,
      CameraModule
    ],
    exports: [
        SegmentationComponent,
        SegmentationListComponent,
        ModelSelectorComponent
    ],
    providers: [
    ]
  })
  export class SegmentationModule {

  }