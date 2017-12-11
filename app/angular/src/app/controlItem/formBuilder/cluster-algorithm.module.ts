import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule, MatFormFieldModule, MatInputModule, MatSelectModule } from "@angular/material";

import { ClusterFormComponent } from "./cluster-form.component";

@NgModule({
    declarations: [
        ClusterFormComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    exports:[
        ClusterFormComponent
    ]
})
export class ClusterAlgorithmModule {}