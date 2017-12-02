import { Injectable } from "@angular/core";
import { Http, URLSearchParams, Headers, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { map } from 'rxjs/operators';

import { baseUrl } from "./settings";
import { CameraSettings } from "./model/camera-settings";

@Injectable()
export class AppService {
    
    constructor(private _http: Http, private _httpClient: HttpClient) {}

    getClusters(pointcloud: Array<Array<number>>): Observable<Response> {
        let body = new FormData();
        if (typeof pointcloud != 'undefined') {
            body.append('points', JSON.stringify(pointcloud));
        }
        return this._http.post(`${baseUrl}/cluster`, body);
    }

    getPoints(filename: string): Observable<Response> {
        return this._http.get(`${baseUrl}/plot/points/${filename}`);
    }

    getCameraSettings(pointcloud: Array<Array<number>>, voxels, name): Observable<CameraSettings> {
        let body = new FormData();
        body.append('name', name);
        if (typeof pointcloud != 'undefined') {
            body.append('points', JSON.stringify(pointcloud));
        }
        if (typeof voxels != 'undefined') {
            body.append('voxels', voxels);
        }
        return this._httpClient.post<CameraSettings>(`${baseUrl}/plot/settings`, body);
    }

    predict(pointcloud: number[][]) {
        let body = new FormData();
        if (typeof pointcloud != 'undefined') {
            body.append('points', JSON.stringify(pointcloud));
        } else {
            throw new TypeError("Point Cloud should be 2d array, not 'undefined'");
        }
        return this._http.post(`${baseUrl}/predict`, body);
    }

}