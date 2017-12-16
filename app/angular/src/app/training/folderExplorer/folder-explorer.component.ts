import { Component, OnChanges, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { TraningService } from "../traning.service";

@Component({
    selector: 'app-folder-explorer',
    templateUrl: 'folder-explorer.component.html'
})
export class FolderExplorerComponent implements OnChanges {

    @Output() selection = new EventEmitter();
    @Input() structure;
    form: FormGroup;

    ngOnChanges() {
        this.form = this.toFormGroup(this.structure);
        this.selection.emit(this.form.value);
    }

    onChange() {
        this.selection.emit(this.form.value);
    }

    private toFormGroup(fields): FormGroup {
        let group: any = {};

        fields.forEach(field => {
            group[field.name] = new FormControl(true);
        });

        return new FormGroup(group);
    }

}