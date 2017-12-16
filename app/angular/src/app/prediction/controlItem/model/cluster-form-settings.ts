import { Cluster, KMeans, MeanShift, DBSCAN } from "../model/ClusterModel";
import { FormField } from "../../../common/formbuilder/model/FormModel";

export const ClusterAlgorithmSettings: FormField.FieldModel[] = [
    {
        name: Cluster.Names.DBSCAN,
        fields: [
            {
                name: DBSCAN.FieldControllNames.EPSILON,
                type: FormField.FieldType.SLIDER,
                default: 0.02,
                min: 0,
                max: 0.5,
                step: 0.001,
                placeholder: 'Epsilon'
            },
            {
                name: DBSCAN.FieldControllNames.MIN_POINTS,
                type: FormField.FieldType.SLIDER,
                default: 10,
                min: 0,
                max: 10000,
                step: 1,
                placeholder: 'Min Points'
            },
            {
                name: DBSCAN.FieldControllNames.ALGORITHM,
                type: FormField.FieldType.SELECTOR,
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
        name: Cluster.Names.MEANSHIFT,
        fields: [
            {
                name: MeanShift.FieldControllNames.BANDWIDTH,
                type: FormField.FieldType.SLIDER,
                default: 0,
                hint: "Auto set bandwidth if set it to 0.",
                placeholder: 'BandWidth'
            },
            {
                name: MeanShift.FieldControllNames.MAX_ITER,
                type: FormField.FieldType.SLIDER,
                default: 300,
                min: 0,
                max: 10000,
                step: 1,
                placeholder: 'Max Iteration'
            }
        ]
    },
    {
        name: Cluster.Names.KMEANS,
        fields: [
            {
                name: KMeans.FieldControllNames.N_CLUSTERS,
                type: FormField.FieldType.SLIDER,
                default: 5,
                min: 0,
                max: 100,
                step: 1,
                placeholder: 'Num of Clusters'
            },
            {
                name: KMeans.FieldControllNames.MAX_ITER,
                type: FormField.FieldType.SLIDER,
                default: 50,
                min: 50,
                max: 3000,
                step: 1,
                placeholder: 'Max Iterations'
            },
            {
                name: KMeans.FieldControllNames.INIT,
                type: FormField.FieldType.SELECTOR,
                placeholder: 'Select Init Method',
                default: KMeans.InitMethod.KMEANSPLUSPLUS,
                options: [
                    KMeans.InitMethod.KMEANSPLUSPLUS,
                    KMeans.InitMethod.RANDOM
                ]
            },
            {
                name: KMeans.FieldControllNames.PRECOMPUTE_DISTANCES,
                type: FormField.FieldType.SELECTOR,
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
                type: FormField.FieldType.SELECTOR,
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