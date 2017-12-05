import { Component } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { DBSCAN, DBSCANAlgorithm, AlgorithmSettings, ClusterAlgorithms } from "../../model/cluster-algorithm";
import { ClusterBuilderService, ClusterAlgorithmSettings } from "./cluster-builder.service";
import { OnChanges } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
    selector: 'app-cluster-form',
    templateUrl: './cluster-form.component.html',
    providers: [ClusterBuilderService]
})
export class ClusterFormComponent {

    form: FormGroup;
    fields = [];

    constructor(private clusterBuilderService: ClusterBuilderService) {}

    onChangeAlgorithm(algorithm: string) {
        let settings: AlgorithmSettings = ClusterAlgorithmSettings.find((value, index, arr)=> {
            if (value.name == algorithm) {
                return true;
            }
        });
        this.fields = settings.fields;
        this.form = this.clusterBuilderService.toFormGroup(settings.fields);
    }

    onSubmit() {

    }

}