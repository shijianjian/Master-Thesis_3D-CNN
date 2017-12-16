import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { PointCloudFile } from '../controlItem/model/FileModel';
import { MainViewService } from '../main-view.service';
import { DatGuiService } from '../dat-gui.service';
import { PointCloudLoader, VoxelGridLoader } from '../camera/util/pointcloud-loader';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {

    @Input() showMenu: boolean = false;
    points: number[][];

    @Output() menuToggle = new EventEmitter<boolean>();

    constructor(
        private _mainViewService: MainViewService,
        private $datGui: DatGuiService,
        private _router: Router
    ) {}

    onMenu() {
        this.menuToggle.emit(true);
    }
    
    onClick() {
        this._router.navigateByUrl('/');
    }

    onUploaded(e: PointCloudFile) {
        this.points = e.points;
        this.$datGui.openGui();
    }

    onReload() {
        this._mainViewService.pointcloud.next(Array.from(this.points));
        this.$datGui.setControlParams({
            size: PointCloudLoader.DefaultPointsParams.size,
            opacity: PointCloudLoader.DefaultPointsParams.opacity,
            wireframe: VoxelGridLoader.DefaultVoxelParams.wireframe
        });
    }

}