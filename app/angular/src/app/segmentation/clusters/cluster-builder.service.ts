import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Algorithm, KMeans, MeanShift, DBSCAN } from "../../model/cluster-algorithm";

@Injectable()
export class ClusterBuilderService {

    constructor() { }
    
    toFormGroup(fields: Algorithm.Field[]): FormGroup {
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

export const ClusterAlgorithmSettings: Algorithm.FieldModel[] = [
    {
        name: Algorithm.Cluster.Names.DBSCAN,
        fields: [
            {
                name: DBSCAN.FieldControllNames.EPSILON,
                type: Algorithm.FieldType.SLIDER,
                default: 0.02,
                min: 0,
                max: 0.5,
                step: 0.001,
                placeholder: 'Epsilon'
            },
            {
                name: DBSCAN.FieldControllNames.MIN_POINTS,
                type: Algorithm.FieldType.SLIDER,
                default: 10,
                min: 0,
                max: 10000,
                step: 1,
                placeholder: 'Min Points'
            },
            {
                name: DBSCAN.FieldControllNames.ALGORITHM,
                type: Algorithm.FieldType.SELECTOR,
                placeholder: 'Select Algorithm',
                default: DBSCAN.Algorithm.BALLTREE,
                options: [
                    DBSCAN.Algorithm.AUTO,
                    DBSCAN.Algorithm.BALLTREE,
                    DBSCAN.Algorithm.BRUTE,
                    DBSCAN.Algorithm.KDTREE
                ]
            }
        ]
    },
    {
        name: Algorithm.Cluster.Names.MEANSHIFT,
        fields: [
            {
                name: MeanShift.FieldControllNames.BANDWIDTH,
                type: Algorithm.FieldType.SLIDER,
                default: 0,
                hint: "Auto set bandwidth if set it to 0.",
                placeholder: 'BandWidth'
            },
            {
                name: MeanShift.FieldControllNames.MAX_ITER,
                type: Algorithm.FieldType.SLIDER,
                default: 300,
                min: 0,
                max: 10000,
                step: 1,
                placeholder: 'Max Iteration'
            }
        ]
    },
    {
        name: Algorithm.Cluster.Names.KMEANS,
        fields: [
            {
                name: KMeans.FieldControllNames.N_CLUSTERS,
                type: Algorithm.FieldType.SLIDER,
                default: 5,
                min: 0,
                max: 100,
                step: 1,
                placeholder: 'Num of Clusters'
            },
            {
                name: KMeans.FieldControllNames.MAX_ITER,
                type: Algorithm.FieldType.SLIDER,
                default: 50,
                min: 50,
                max: 3000,
                step: 1,
                placeholder: 'Max Iterations'
            },
            {
                name: KMeans.FieldControllNames.INIT,
                type: Algorithm.FieldType.SELECTOR,
                placeholder: 'Select Init Method',
                default: KMeans.InitMethod.KMEANSPLUSPLUS,
                options: [
                    KMeans.InitMethod.KMEANSPLUSPLUS,
                    KMeans.InitMethod.RANDOM
                ]
            },
            {
                name: KMeans.FieldControllNames.PRECOMPUTE_DISTANCES,
                type: Algorithm.FieldType.SELECTOR,
                placeholder: 'Enable Precompute Distance',
                default: KMeans.PrecomputeDistance.AUTO,
                options: [
                    KMeans.PrecomputeDistance.AUTO,
                    KMeans.PrecomputeDistance.TRUE,
                    KMeans.PrecomputeDistance.FALSE
                ]
            },
            {
                name: KMeans.FieldControllNames.ALGORITHM,
                type: Algorithm.FieldType.SELECTOR,
                placeholder: 'K-Means Algorithm',
                default: KMeans.Algorithm.AUTO,
                options: [
                    KMeans.Algorithm.AUTO,
                    KMeans.Algorithm.FULL,
                    KMeans.Algorithm.ELKAN
                ]
            }
        ]
    }
]