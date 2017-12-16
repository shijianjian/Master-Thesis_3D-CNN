import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatListModule, MatIconModule, MatCheckboxModule, MatCardModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FolderExplorerComponent} from "./folder-explorer.component";
import { FolderPlotComponent } from "./folder-plot.component";

@NgModule({
    declarations: [
        FolderExplorerComponent,
        FolderPlotComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule, 
        ReactiveFormsModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatCheckboxModule
    ],
    exports: [
        FolderExplorerComponent,
        FolderPlotComponent
    ]
})
export class FolderExplorerModule {

}