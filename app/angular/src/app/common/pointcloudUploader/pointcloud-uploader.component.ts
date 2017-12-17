import { Component, Output, EventEmitter } from "@angular/core";
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { MatSelectChange } from "@angular/material";

import { baseUrl } from '../../settings';
import { MainService } from "../../main.service";
import { PointCloudFile } from "./model/FileModel";

@Component({
    selector: 'app-pointcloud-uploader',
    templateUrl: './pointcloud-uploader.component.html',
    styles: [`
      :host {
        display: block;
      }
    `]
})
export class PointCloudUploaderComponent {

    uploader: FileUploader;
    uploadState: boolean;
    filename: string;

    @Output() uploaded = new EventEmitter<PointCloudFile>();
    
    constructor(
        private $mainService: MainService
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
            this.$mainService.getPoints(this.filename).subscribe(
                data => {
                    this.uploaded.emit({
                        filename: this.filename,
                        points: data.json()
                    });
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