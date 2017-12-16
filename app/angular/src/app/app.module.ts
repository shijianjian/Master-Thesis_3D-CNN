import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { PredictionPageModule } from './prediction/prediction-page.module';
import { TrainingPageModule } from './training/training-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HomeModule,
    PredictionPageModule,
    TrainingPageModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
