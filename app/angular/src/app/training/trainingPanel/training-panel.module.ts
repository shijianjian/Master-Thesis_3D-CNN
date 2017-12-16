import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatSliderModule, 
         MatCardModule, MatButtonModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainingPanelComponent } from "./training-panel.component";
import { DataAugmentationComponent } from "./data-aug.component";


@NgModule({
    declarations: [
        TrainingPanelComponent,
        DataAugmentationComponent
    ],
    imports: [
        BrowserModule,
        FormsModule, 
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatButtonModule,
        MatSelectModule,
        MatCardModule,
        MatCheckboxModule
    ],
    exports: [
        TrainingPanelComponent
    ]
})
export class TrainingPanelModule {

}