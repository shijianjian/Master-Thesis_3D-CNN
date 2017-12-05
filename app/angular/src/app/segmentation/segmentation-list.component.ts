import { Component, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { PageEvent } from '@angular/material';

import { PointsSettings } from '../model/points-settings';

@Component({
  selector: 'app-segmentation-list',
  templateUrl: './segmentation-list.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class SegmentationListComponent implements DoCheck {

  pageSize = 5;
  pageSizeOptions = [5, 10];

  currentItemIndex = 1;

  selectedSegments: Array<PointsSettings> = [];

  @Input() segments: Array<PointsSettings>;

  running: boolean = false;

  ngDoCheck() {
    if (this.selectedSegments.length < this.pageSize 
          && this.segments.length > this.selectedSegments.length) {
      this.selectedSegments = Array.from(this.segments.slice(0, this.pageSize));
    }
  }

  onPageUpdate(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.currentItemIndex = pageEvent.pageSize * pageEvent.pageIndex;
    this.selectedSegments = Array.from(this.segments.slice(
      this.currentItemIndex, 
      this.currentItemIndex + this.pageSize
    ));
  }

}