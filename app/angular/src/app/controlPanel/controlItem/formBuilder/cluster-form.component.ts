import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Algorithm } from "../../../model/cluster-algorithm";
import { ClusterBuilderService, ClusterAlgorithmSettings } from "./cluster-builder.service";

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
        let settings: Algorithm.FieldModel = ClusterAlgorithmSettings.find((value, index, arr)=> {
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