import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AlgorithmSettings, DBSCANAlgorithm, Field } from "../../model/cluster-algorithm";

@Injectable()
export class ClusterBuilderService {

    constructor() { }
    
    toFormGroup(fields: Field[]): FormGroup {
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

export const ClusterAlgorithmSettings: AlgorithmSettings[] = [
    {
        name: 'dbscan',
        fields: [
            {
                name: 'epsilon',
                type: 'slider',
                default: 0.02,
                min: 0,
                max: 0.5,
                step: 0.001,
                placeholder: 'Epsilon'
            },
            {
                name: 'minPoints',
                type: 'slider',
                default: 10,
                min: 0,
                max: 10000,
                step: 1,
                placeholder: 'Min Points'
            },
            {
                name: 'algorithm',
                type: 'selector',
                placeholder: 'Select Algorithm',
                default: DBSCANAlgorithm.BALLTREE,
                options: [
                    DBSCANAlgorithm.AUTO,
                    DBSCANAlgorithm.BALLTREE,
                    DBSCANAlgorithm.BRUTE,
                    DBSCANAlgorithm.KDTREE
                ]
            }
        ]
    },
    {
        name: 'mean_shift',
        fields: [
            {
                name: 'bandwidth',
                type: 'slider',
                default: 0,
                hint: "Auto set bandwidth if set it to 0.",
                placeholder: 'BandWidth'
            },
            {
                name: 'max_iter',
                type: 'slider',
                default: 300,
                min: 0,
                max: 10000,
                step: 1,
                placeholder: 'Max Iteration'
            }
        ]
    }
]