import { Component, OnChanges, EventEmitter, Output, Input, HostBinding } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { TraningService } from "../traning.service";
import { FolderInfo } from "../model/FolderStructure";

@Component({
    selector: 'app-folder-explorer',
    templateUrl: 'folder-explorer.component.html',
    styles: [`
    :host {
        display: block;
    }
    `]
})
export class FolderExplorerComponent implements OnChanges {

    @Output() selection = new EventEmitter();
    @Input() structure: FolderInfo[];
    @HostBinding('class.row') binding = true;
    form: FormGroup;

    minNumber = 0;
    maxNumber = 0;

    ngOnChanges() {
        this.form = this.toFormGroup(this.structure);
        this.maxNumber = this.getMax(this.structure);
        this.onChange();
    }

    onChange() {
        this.selection.emit(this.form.value);
    }

    onFilter(e) {
        this.filter(this.structure, e.min, e.max);
        this.onChange();
    }

    private filter(fields: FolderInfo[], min?: number, max?: number) {
        let group: any = {};
        if (typeof min == 'undefined' || min == null) {
            min = 0;
        }
        if (typeof max == 'undefined' || max == null) {
            max = this.getMax(fields);
        }
        let names = [];
        fields.forEach(field => {
            if (field.size >= min && field.size <= max) {
                this.form.controls[field.name].setValue(true);
            } else {
                this.form.controls[field.name].setValue(false);
            }
        });
    }

    private toFormGroup(fields: FolderInfo[]): FormGroup {
        let group: any = {};
        fields.forEach(field => {
            group[field.name] = new FormControl(true);
        });
        return new FormGroup(group);
    }


    private getMax(fields: FolderInfo[]): number {
        let max = 0;
        fields.forEach(field => {
            if(field.size > max) {
                max = field.size;
            }
        });
        return max;
    }
}