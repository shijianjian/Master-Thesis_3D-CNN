import { Injectable } from "@angular/core";
import { Http, URLSearchParams, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { map } from 'rxjs/operators';

import { baseUrl } from "./settings";

@Injectable()
export class AppService {
    
    constructor(private _http: Http) {}

    getClusters(): Observable<Response> {
        return this._http.get(`${baseUrl}/cluster`)
                        .pipe(map(res => res.json()))
    }

}