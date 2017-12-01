import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { AppService } from './app.service';
import { baseUrl } from './settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  uploader: FileUploader;
  response:string;

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
      this.uploader.uploadAll();
    };
    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );
  }

  ngOnInit() {
    this.$appService.getClusters().subscribe(
      data => {
        console.log(data);
      }
    )
  }

  private prepareUploader(file) {
    this.uploader.onBuildItemForm = (item, form) => {
        form.append("file", file);
    }
  }

}
