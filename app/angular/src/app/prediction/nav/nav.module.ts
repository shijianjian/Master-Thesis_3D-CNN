import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatIconModule } from '@angular/material';
import { NavComponent } from './nav.component';
import { ControlItemModule } from '../controlItem/control-item.module';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatIconModule,
    ControlItemModule
  ],
  exports: [
    NavComponent
  ],
  providers: [
  ]
})
export class NavModule { }
