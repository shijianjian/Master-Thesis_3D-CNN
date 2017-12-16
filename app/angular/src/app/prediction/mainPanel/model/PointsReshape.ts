export namespace PointsReshape {

    export enum Names {
        GAUSSIAN_NOISE="noise",
        SQUEEZE="squeeze"
    }

    export interface Output {
        name: Names;
        cluster: GaussianNoise.Fields | Squeeze.Fields;
    }

}

export namespace GaussianNoise {

    export interface Fields {
        n_size: number;
        n_var: number;
    }

    export enum FieldControllNames {
        SIZE = 'n_size',
        VARIANCE = 'n_var'
    }

    export enum FieldPlaceholders {
        SIZE = 'NoiseSize',
        VARIANCE = 'Noise Variance'
    }
}

export namespace Squeeze {

    export interface Fields {
        x_ratio: number;
        y_ratio: number;
        z_ratio: number;
    }

    export enum FieldControllNames {
        X_RATIO="x_ratio",
        Y_RATIO="Y_ratio",
        Z_RATIO="z_ratio"
    }

    export enum FieldPlaceholders {
        X_RATIO="X Ratio",
        Y_RATIO="Y Ratio",
        Z_RATIO="Z Ratio"
    }


}