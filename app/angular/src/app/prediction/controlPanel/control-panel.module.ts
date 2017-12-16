import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule, MatCheckboxModule } from '@angular/material';

import { ControlPanelComponent } from './control-panel.component';
import { ControlItemModule } from '../controlItem/control-item.module';

@NgModule({
  declarations: [
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    MatSidenavModule,
    MatCheckboxModule,
    ControlItemModule
  ],
  exports: [
    ControlPanelComponent
  ],
  providers: [
  ]
})
export class ControlPanelModule { }
