import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { AppService } from './app.service';
import { baseUrl } from './settings';
import { CameraSettings } from './model/camera-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [``]
})
export class AppComponent implements OnInit {

  uploader: FileUploader;
  response: string;
  filename: string;

  pointcloud: Array<Array<number>>;
  segs: CameraSettings[] = [];
  cameraSettings: CameraSettings;

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
      this.prepareUploader(file);
      this.filename = file._file.name;
      this.uploader.uploadAll();
    };
    this.response = '';

    this.uploader.response.subscribe(res => {
      this.response = res;
      this.$appService.getPoints(this.filename).subscribe(
        data => {
          this.pointcloud = data.json();
          this.$appService.getCameraSettings(this.pointcloud, undefined, this.filename).subscribe(
            data => {
              this.cameraSettings = data;
            }
          )
        }
      )
    });

  }

  ngOnInit() {
    
  }

  private prepareUploader(file) {
    this.uploader.onBuildItemForm = (item, form) => {
        form.append("file", file);
    }
  }

  segment() {
    this.$appService.getClusters(this.pointcloud).subscribe(
      data => {
        for(let key in data.json()) {
          this.$appService.getCameraSettings(data.json()[key], undefined, `${this.filename}_${key}`).subscribe(
            csetting => {
              this.segs.push(csetting);
            }
          )
        }
        this.segs = Array.from(Object.assign({}, this.segs));
      }
    )
  }

}
