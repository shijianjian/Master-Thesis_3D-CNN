import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { PointCloudFile } from '../controlItem/model/FileModel';
import { MainViewService } from '../main-view.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {

    @Input() showMenu: boolean = false;
    points: number[][];

    @Output() menuToggle = new EventEmitter<boolean>();

    constructor(private _mainViewService: MainViewService) {}

    onMenu() {
        this.menuToggle.emit(true);
    }

    onUploaded(e: PointCloudFile) {
        this.points = e.points;
    }

    onReload() {
        this._mainViewService.pointcloud.next(this.points);
    }

}