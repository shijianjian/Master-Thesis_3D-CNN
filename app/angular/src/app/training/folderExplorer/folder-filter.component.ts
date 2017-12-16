import { Component, Input, OnChanges, Output, EventEmitter, HostBinding } from "@angular/core";

@Component({
    selector: 'app-folder-filter',
    templateUrl: 'folder-filter.component.html'
})
export class FolderFilterComponent implements OnChanges {

    @Input() max: number = 0;
    @Input() min = 0;
    @Output() filter = new EventEmitter();

    showPanel = false;
    touched = false;
    maxNumber;
    minNumber;

    ptsExt = true;
    ptxExt = true;

    ngOnChanges() {
        if(!this.touched) {
            this.maxNumber = this.max;
            this.minNumber = this.min;
        }
    }

    onClick() {
        this.showPanel = true;
    }

    onFilter() {
        this.touched = true;
        this.filter.emit({
            min: this.minNumber,
            max: this.maxNumber
        })
    }

    onConfirm() {
        this.onFilter();
        this.showPanel = false;
    }

}