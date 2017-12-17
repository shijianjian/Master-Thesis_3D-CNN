import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatIconModule } from '@angular/material';
import { NavComponent } from './nav.component';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatIconModule
  ],
  exports: [
    NavComponent
  ],
  providers: [
  ]
})
export class NavModule { }
