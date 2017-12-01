import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { CameraComponent } from './camera/camera.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
