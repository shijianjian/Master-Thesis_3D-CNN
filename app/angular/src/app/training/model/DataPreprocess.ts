
export namespace DataAugmentation {

    export interface Settings {
        noise: GaussianNoiseSettings;
        squeeze: SqueezeSettings;
        rotate: RotationSettings;
    }

    export interface GaussianNoiseSettings {
        enabled: boolean;
    }

    export interface SqueezeSettings {
        enabled: boolean;
    }

    export interface RotationSettings {
        enabled: boolean;
    }

}

export interface TrainingSettings {
    size: number;
    augment: DataAugmentation.Settings;
}