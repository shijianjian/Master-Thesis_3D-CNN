import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule, MatFormFieldModule, MatInputModule, MatSelectModule } from "@angular/material";

import { FormBuilderService } from "./formbuilder/form-builder.service";
import { FormBuilderComponent } from "./formbuilder/form-builder.component";

@NgModule({
    declarations: [
        FormBuilderComponent
    ],
    imports: [
        BrowserModule,
        MatSliderModule, 
        MatFormFieldModule, 
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormBuilderComponent
    ],
    providers: [
        FormBuilderService
    ]
})
export class CommonsModule {}