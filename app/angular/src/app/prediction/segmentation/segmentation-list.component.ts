import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PageEvent } from '@angular/material';
import { CanvasSettings } from '../model/visual-settings';
import { MainViewService } from '../main-view.service';

@Component({
  selector: 'app-segmentation-list',
  templateUrl: './segmentation-list.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .seg-display {
      display: flex; 
      flex-direction: column;
      height: 100%;
      overflow-y: scroll;
    }
  `]
})
export class SegmentationListComponent implements OnChanges {

  pageSize = 5;
  pageSizeOptions = [5, 10];

  currentItemIndex = 1;

  selectedSegments: Array<number[][]> = [];

  @Input() segments: Array<number[][]> = [];
  canvasSettings: CanvasSettings = {
    width: window.innerWidth*0.25,
    height: window.innerHeight*0.2
  }

  running: boolean = false;

  constructor(private _mainViewService: MainViewService) {}

  ngOnChanges() {
      this.selectedSegments = Array.from(this.segments.slice(0, this.pageSize));
  }

  onPageUpdate(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.currentItemIndex = pageEvent.pageSize * pageEvent.pageIndex;
    this.selectedSegments = Array.from(this.segments.slice(
      this.currentItemIndex, 
      this.currentItemIndex + this.pageSize
    ));
  }

  onLaunch(seg: number[][]) {
    this._mainViewService.pointcloud.next(seg);
  }

}