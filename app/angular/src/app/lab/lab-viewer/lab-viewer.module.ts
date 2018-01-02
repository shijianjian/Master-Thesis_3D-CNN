import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material";

import { LabViewerComponent } from "./lab-viewer.component";
import { BrowserModule } from "@angular/platform-browser";
import { CameraModule } from "../../common/camera/camera.module";

@NgModule({
    declarations: [
      LabViewerComponent,
    ],
    imports: [
      BrowserModule,
      CameraModule,
      MatIconModule
    ],
    exports: [
      LabViewerComponent
    ],
    providers: [
    ]
  })
  export class LabViewerModule { }