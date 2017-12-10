import { Component, Output, EventEmitter } from "@angular/core";
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { MatSelectChange } from "@angular/material";

import { AppService } from "../../app.service";
import { baseUrl } from './../../settings';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styles: [`
      :host {
        display: inline-block;
      }
    `]
})
export class FileUploaderComponent {

    uploader: FileUploader;
    uploadState: boolean;
    filename: string;

    @Output() uploaded = new EventEmitter<number[][]>();
    
    constructor(
        private $appService: AppService
    ){
        this.uploader = new FileUploader({
            url: `${baseUrl}/upload`,
            headers: [
            {
                name: "Access-Control-Allow-Credentials",
                value: "true"
            }, 
            {
                name: "Access-Control-Allow-Origin",
                value: baseUrl
            }
            ],
            disableMultipart: false
        });

        this.uploader.onAfterAddingFile = (file) => {
            this.uploadState = false;
            this.prepareUploader(file);
            this.filename = file._file.name;
            this.uploader.uploadAll();
        };

        this.uploader.response.subscribe(res => {
            this.uploadState = true;
            this.$appService.getPoints(this.filename).subscribe(
                data => {
                    this.uploaded.emit(data.json());
                }
            )
        });

  }

    private prepareUploader(file) {
        this.uploader.onBuildItemForm = (item, form) => {
            form.append("file", file);
        }
    }


}