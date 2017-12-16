import { Component, OnInit } from '@angular/core';
import { TraningService } from './traning.service';

@Component({
	selector: 'app-training-page',
	templateUrl: './training-page.component.html',
	styles: [`
	`]
})
export class TrainingPageComponent implements OnInit {

    structure = [];
    selection = {};

    constructor(private $trainingService: TraningService) { }

    ngOnInit() {
        this.getStructure();
    }

    getStructure() {
        let sub = this.$trainingService.getFolderStructure().subscribe(
            data => {
                this.structure = data.json();
            },
            err => {},
            () => {
                sub.unsubscribe();
            }
        )
    }

    onSelected(e) {
        this.selection = e;
    }
}