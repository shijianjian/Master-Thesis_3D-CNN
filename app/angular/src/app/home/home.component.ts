import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styles: [`
    :host {
        display: flex;
        justify-content: space-around;
        margin-top: 20vh;
    }
    .welcome-section {
        display: flex;
        justify-content: center;
        height: 20vw;
        border: 3px dashed blue;
    }
    .welcome-section:hover {
        cursor: pointer;
    }
    .welcome-icon {
        font-size: 10em;
        inline-size: 1em;
    }
    `]
})
export class HomeComponent {

    constructor(private _router: Router) {

    }

    onPrediction() {
        this._router.navigateByUrl('/prediction');
    }

    onTraining() {
        this._router.navigateByUrl('/training');
    }

    onLaboratory() {
        this._router.navigateByUrl('/lab');
    }

}