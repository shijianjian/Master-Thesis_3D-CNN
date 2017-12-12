import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FormField } from "./model/FormModel";

@Injectable()
export class FormBuilderService {

    constructor() { }
    
    toFormGroup(fields: FormField.Field[]): FormGroup {
        let group: any = {};

        fields.forEach(field => {
            let validators = [];
            if (field.required) { validators.push(Validators.required); }
            if (typeof field.min == 'number') { validators.push(Validators.min(field.min)); }
            if (typeof field.max == 'number') { validators.push(Validators.max(field.max)); }
            let defaultValue = typeof field.default != 'undefined' ? field.default : '';
            group[field.name] = new FormControl(defaultValue, validators);
        });

        return new FormGroup(group);
    }

}