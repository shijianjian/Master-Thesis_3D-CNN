
export enum ClusterAlgorithms {
    DBSCAN='dbscan',
    MEANSHIFT='mean_shift'
}

export interface AlgorithmSettings {
    name: string;
    fields: (Field | SliderField | SelectorField)[]
}

export interface Field {
    name: string;
    type: 'slider' | 'selector';
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

export interface ClusterSettings {
    cluster: DBSCAN | MeanShift;
}

export interface DBSCAN {
    epsilon: number;
    minPoints: number;
    algorithm: DBSCANAlgorithm
}

export enum DBSCANAlgorithm {
    AUTO = "auto",
    BALLTREE = "ball_tree",
    KDTREE = "kd_tree",
    BRUTE = "brute"
}

export interface MeanShift {
    bandwidth: number;
    max_iter: number;
}