import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { CameraComponent } from './camera/camera.component';
import { AppService } from './app.service';
import { CameraGuiService } from './camera-gui.service';

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FileUploadModule
  ],
  providers: [
    AppService,
    CameraGuiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
