export namespace FormField {

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