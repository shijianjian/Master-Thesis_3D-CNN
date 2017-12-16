import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatListModule, MatIconModule, MatButtonModule, MatCheckboxModule, 
         MatCardModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule,
         MatSliderModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FolderExplorerComponent} from "./folder-explorer.component";
import { FolderPlotComponent } from "./folder-plot.component";
import { FolderFilterComponent } from "./folder-filter.component";

@NgModule({
    declarations: [
        FolderExplorerComponent,
        FolderPlotComponent,
        FolderFilterComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule, 
        ReactiveFormsModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    exports: [
        FolderExplorerComponent,
        FolderPlotComponent
    ]
})
export class FolderExplorerModule {

}