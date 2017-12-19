import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { baseUrl } from "../settings";
import { DataPrepSettings, TrainingSettings } from "./model/DataPreprocess";

@Injectable()
export class TraningService {

    constructor(
        private _http: Http
    ) {}

    getFolderStructure() {
        return this._http.get(baseUrl + '/folder_structure');
    }

    getDataSet() {
        return this._http.get(baseUrl + '/datasets');
    }

    getDevices() {
        return this._http.get(baseUrl + '/train/devices');
    }

    buildH5File(h5Settings: DataPrepSettings) {
        let body = new FormData();
        body.append('aug_settings', JSON.stringify(h5Settings));
        return this._http.post(baseUrl + '/dataset/build', body);
    }

    training(dataset: string, trainingSettings: TrainingSettings) {
        let body = new FormData();
        body.append('dataset', dataset);
        body.append('training_settings', JSON.stringify(trainingSettings));
        return this._http.post(baseUrl + '/train/cnn', body);
    }

}