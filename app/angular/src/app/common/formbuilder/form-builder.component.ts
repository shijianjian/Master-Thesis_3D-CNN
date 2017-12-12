import { Component, Input, OnChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { FormField } from "./model/FormModel";
import { FormBuilderService } from "./form-builder.service";

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent implements OnChanges {

    @Input() fieldModel: FormField.FieldModel;
    fields = [];

    form: FormGroup;

    constructor(private formBuilderService: FormBuilderService) {}

    ngOnChanges() {
        if (typeof this.fieldModel == 'undefined') {
            return;
        }
        this.fields = this.fieldModel.fields;
        this.form = this.formBuilderService.toFormGroup(this.fieldModel.fields);
    }

    onSubmit() {

    }

}