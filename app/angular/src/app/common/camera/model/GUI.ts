import { GUIController } from 'dat-gui'

export enum GuiControllerTypes {
    SIZE,
    WIREFRAME,
    OPACITY
}

export interface GuiControllers {
    FigureSize: GUIController,
    FigureMaterial: GUIController,
    FigureOpacity:GUIController
}

export interface GuiParameters {
    size: number,
    opacity: number,
    wireframe: boolean,
}
