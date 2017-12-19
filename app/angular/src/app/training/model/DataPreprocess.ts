
export namespace DataAugmentation {

    export interface Settings {
        noise: GaussianNoiseSettings;
        squeeze: SqueezeSettings;
        rotate: RotationSettings;
        min_value: number;
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

export interface DataPrepSettings {
    size: number;
    filename: string;
    augment: DataAugmentation.Settings;
    min_filter?: number;
    max_filter?: number;
}

export interface TrainingSettings {
    learning_rate: number;
    keep_rate: number;
    seed: number;
    trainset: number;
    device: string;
    strategy: LearningStrategy;
    epochs: number;
    batch_size: number;
}

export enum LearningStrategy {
    TRAIN="Train",
    TRANSFER_LEARNING="Transfer Learning"
}