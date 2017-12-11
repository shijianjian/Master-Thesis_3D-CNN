

export namespace Algorithm {

    export namespace Cluster {

        export enum Names {
            DBSCAN='dbscan',
            MEANSHIFT='mean_shift',
            KMEANS='kmeans'
        }

        export interface Output {
            name: Names;
            cluster: DBSCAN.Fields | MeanShift.Fields | KMeans.Fields;
        }

    }

    export interface FieldModel {
        name: string;
        fields: (Field | SliderField | SelectorField)[]
    }

    export enum FieldType {
        SLIDER = 'slider',
        SELECTOR = 'selector'
    }

    export interface Field {
        name: string;
        type: FieldType;
        placeholder: string;
        default?: number | string | boolean;
        required?: boolean;
        min?: number;
        max?: number;
        hint?: string;
    }

    export interface SliderField extends Field {
        step: number;
    }

    export interface SelectorField extends Field {
        options: string[];
    }

}


export namespace DBSCAN {

    export interface Fields {
        epsilon: number;
        minPoints: number;
        algorithm: Algorithm
    }

    export enum FieldControllNames {
        EPSILON = 'epsilon',
        MIN_POINTS = 'minPoints',
        ALGORITHM = 'algorithm'
    }

    export enum Algorithm {
        AUTO = "auto",
        BALLTREE = "ball_tree",
        KDTREE = "kd_tree",
        BRUTE = "brute"
    }
}

export namespace MeanShift {

    export interface Fields {
        bandwidth: number;
        max_iter: number;
    }

    export enum FieldControllNames {
        BANDWIDTH = 'bandwidth',
        MAX_ITER = 'max_iter'
    }

}

export namespace KMeans{

    export interface Fields {
        n_clusters: number;
        init: string;
        max_iter: number;
        precompute_distances: string;
        algorithm: string;
    }

    export enum FieldControllNames {
        N_CLUSTERS = 'n_clusters',
        INIT = 'init',
        MAX_ITER = 'max_iter',
        PRECOMPUTE_DISTANCES = 'precompute_distances',
        ALGORITHM = 'algorithm'
    }

    export enum InitMethod {
        KMEANSPLUSPLUS = 'k-means++', 
        RANDOM = 'random'
    }

    export enum PrecomputeDistance {
        AUTO = 'auto',
        TRUE = 'true',
        FALSE = 'false'
    }

    export enum Algorithm {
        AUTO = 'auto',
        FULL = 'full',
        ELKAN = 'elkan'
    }

}
