import { FormField } from "../../../common/formbuilder/model/FormModel";
import { PointsReshape, GaussianNoise, Squeeze } from "./../model/PointsReshape";

export const ClusterAlgorithmSettings: FormField.FieldModel[] = [
    {
        name: PointsReshape.Names.GAUSSIAN_NOISE,
        fields: [
            {
                name: GaussianNoise.FieldControllNames.SIZE,
                type: FormField.FieldType.SLIDER,
                default: 0,
                min: 0,
                max: 100,
                step: 1,
                placeholder: GaussianNoise.FieldPlaceholders.SIZE
            },
            {
                name: GaussianNoise.FieldControllNames.VARIANCE,
                type: FormField.FieldType.SLIDER,
                default: 1,
                min: 0,
                max: 3,
                step: 0.1,
                placeholder: GaussianNoise.FieldPlaceholders.VARIANCE
            }
        ]
    },
    {
        name: PointsReshape.Names.SQUEEZE,
        fields: [
            {
                name: Squeeze.FieldControllNames.X_RATIO,
                type: FormField.FieldType.SLIDER,
                default: 0,
                min: 0,
                max: 100,
                step: 1,
                placeholder: Squeeze.FieldPlaceholders.X_RATIO
            },
            {
                name: Squeeze.FieldControllNames.Y_RATIO,
                type: FormField.FieldType.SLIDER,
                default: 0,
                min: 0,
                max: 100,
                step: 1,
                placeholder: Squeeze.FieldPlaceholders.Y_RATIO
            },
            {
                name: Squeeze.FieldControllNames.Z_RATIO,
                type: FormField.FieldType.SLIDER,
                default: 0,
                min: 0,
                max: 100,
                step: 1,
                placeholder: Squeeze.FieldPlaceholders.Z_RATIO
            },
        ]
    }
]