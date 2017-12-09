import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PageEvent } from '@angular/material';

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
export class SegmentationListComponent implements OnChanges {

  pageSize = 5;
  pageSizeOptions = [5, 10];

  currentItemIndex = 1;

  selectedSegments: Array<number[][]> = [];

  @Input() segments: Array<number[][]> = [];

  running: boolean = false;

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

}