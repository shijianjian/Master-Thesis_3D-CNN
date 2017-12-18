import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatSliderModule, 
         MatCardModule, MatButtonModule, MatSelectModule, MatCheckboxModule, MatStepperModule,
         MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainingPanelComponent } from "./training-panel.component";
import { DataAugmentationComponent } from "./data-aug.component";
import { BuildFileComponent } from "./build-file.component";
import { TrainingSettingsComponent } from "./training-settings.component";


@NgModule({
    declarations: [
        TrainingPanelComponent,
        DataAugmentationComponent,
        BuildFileComponent,
        TrainingSettingsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule, 
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSelectModule,
        MatButtonModule,
        MatStepperModule,
        MatRadioModule,
        MatCardModule,
        MatCheckboxModule
    ],
    exports: [
        TrainingPanelComponent
    ]
})
export class TrainingPanelModule {

}