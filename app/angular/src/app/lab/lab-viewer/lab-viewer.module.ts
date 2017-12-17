import { NgModule } from "@angular/core";

import { LabViewerComponent } from "./lab-viewer.component";
import { BrowserModule } from "@angular/platform-browser";
import { CameraModule } from "../../common/camera/camera.module";

@NgModule({
    declarations: [
      LabViewerComponent,
    ],
    imports: [
      BrowserModule,
      CameraModule
    ],
    exports: [
      LabViewerComponent
    ],
    providers: [
    ]
  })
  export class LabViewerModule { }