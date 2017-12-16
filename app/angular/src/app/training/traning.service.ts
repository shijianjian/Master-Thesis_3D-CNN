import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { baseUrl } from "../settings";

@Injectable()
export class TraningService {

    constructor(
        private _http: Http
    ) {}

    getFolderStructure() {
        return this._http.get(baseUrl + '/folder_structure');
    }

}