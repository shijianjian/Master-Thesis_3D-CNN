import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";

import {baseUrl} from './settings';

@Injectable()
export class MainService {

    constructor(private _http: Http) {}
    
    public pointcloud: Subject<number[][]> = new BehaviorSubject<number[][]>([]);

    getPoints(filename: string): Observable<Response> {
        return this._http.get(`${baseUrl}/plot/points/${filename}`);
    }

}