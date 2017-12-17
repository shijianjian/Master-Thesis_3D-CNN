import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { PredictionPageModule } from './prediction/prediction-page.module';
import { TrainingPageModule } from './training/training-page.module';
import { LaboratoryModule } from './lab/laboratory.module';
import { GlobalDatGuiService } from './global-dat-guil.service';
import { MainService } from './main.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HomeModule,
    PredictionPageModule,
    TrainingPageModule,
    LaboratoryModule
  ],
  providers: [
    GlobalDatGuiService,
    MainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
