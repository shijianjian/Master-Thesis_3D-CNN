import { Component, HostBinding } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { AppService } from './app.service';
import { baseUrl } from './settings';
import { CameraSettings } from './model/camera-settings';
import { PointsGroup } from './model/pointsGroup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: {'[class.container]': 'cont'},
  styles: [`
  :host {
    display: flex;
    padding-top: 30px;
  }
  `]
})
export class AppComponent {

  uploader: FileUploader;
  uploadState: boolean;
  filename: string;

  pointcloud: Array<Array<number>>;
  segs: Array<PointsGroup> = [];
  cameraSettings: CameraSettings;

  @HostBinding('class.container') cont: boolean = true;

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

  private prepareUploader(file) {
    this.uploader.onBuildItemForm = (item, form) => {
        form.append("file", file);
    }
  }

  predict(points: number[][], index: number) {
    this.$appService.predict(points).subscribe((data) => {
      this.segs[index].result = data.json();
    })
  }

  segment() {
    this.$appService.getClusters(this.pointcloud).subscribe(data => {
        let dict = data.json();
        for(let key in dict) {
          this.$appService.getCameraSettings(dict[key], undefined, `${this.filename}_${key}`).subscribe(
            csetting => {
              this.segs.push({
                points: dict[key],
                camera: csetting
              })
            }
          )
        }
        this.segs = Array.from(Object.assign({}, this.segs));
      }
    )
  }

}
