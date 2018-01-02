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
        border: 5px dashed ghostwhite;
        border-radius: 25px;
        background-color: snow;
    }
    .welcome-section:hover {
        cursor: pointer;
        opacity: 0.9
    }
    .welcome-icon {
        font-size: 10em;
        inline-size: 1em;
    }
    .home-label {
        text-align: center;
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