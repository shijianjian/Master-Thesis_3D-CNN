import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

import { TrainingPageComponent } from "./training-page.component";
import { NavModule } from "./nav/nav.module";
import { FolderExplorerModule } from "./folderExplorer/folder-explorer.module";
import { TraningService } from "./traning.service";

@NgModule({
    declarations: [
        TrainingPageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NavModule,
        FolderExplorerModule
    ],
    providers: [
        TraningService
    ]
})
export class TrainingPageModule {

}