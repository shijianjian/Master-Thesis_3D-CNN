import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { PointsGroup, ClusterSettings } from '../model/pointsGroup';

@Component({
  selector: 'app-segmentation',
  templateUrl: './segmentation.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class SegmentationComponent {
    epsilon_min = 0;
    epsilon_max = 0.5;
    epsilon_step = 0.001;

    min_points = 0;
    max_points = 10000;
    points_step = 1;

    points = 10;
    epsilon = 0.01;

    @Input() pointcloud;
    @Input() filename;

    @Output() segments = new EventEmitter<PointsGroup[]>();

    constructor(
      private $appService: AppService
    ) {}

    epsilonControll = new FormControl('', [
      Validators.max(this.epsilon_max),
      Validators.min(this.epsilon_min)
    ]);
    pointsControll = new FormControl('', [
      Validators.max(this.max_points),
      Validators.min(this.min_points)
    ]);

    segment() {
      let settings: ClusterSettings = {
        points: this.pointcloud,
        epsilon: this.epsilon,
        minPoints: this.points
      }
      this.$appService.getClusters(settings).subscribe(data => {
          let segs: PointsGroup[] = [];
          let dict = data.json();
          for(let key in dict) {
            this.$appService.getCameraSettings(dict[key], undefined, `${this.filename}_${key}`).subscribe(
              csetting => {
                segs.push({
                  points: dict[key],
                  camera: csetting
                })
              }
            )
          }
          this.segments.emit(segs);
        }
      )
    }

}