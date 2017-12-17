import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Response, Http } from "@angular/http";

import { MainService } from "../main.service";
import { baseUrl } from "../settings";

@Injectable()
export class LaboratoryService {

    public voxelgrid: BehaviorSubject<number[][][]> = new BehaviorSubject<number[][][]>([]);
    public outputgrid: BehaviorSubject<number[][][]> = new BehaviorSubject<number[][][]>([]);

    constructor(private $mainService: MainService, private _http: Http) {}

    getPoints(filename: string): Observable<Response> {
        return this.$mainService.getPoints(filename);
    }

    get pointcloud(): Subject<number[][]>  {
        return this.$mainService.pointcloud;
    }

    conv3d(voxel: number[][][], kernel: number[][][], stride: number, padding: string) {
        let body = new FormData();
        body.append('voxel', JSON.stringify(voxel));
        body.append('kernel', JSON.stringify(kernel));
        body.append('stride', stride.toString());
        body.append('padding', padding);

        return this._http.post(`${baseUrl}/lab/conv`, body);
    }

}