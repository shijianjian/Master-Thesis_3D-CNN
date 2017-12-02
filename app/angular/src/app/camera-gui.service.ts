import { Injectable } from "@angular/core";
import { GUI, GUIController } from 'dat-gui'

import * as dat from 'dat.gui/build/dat.gui.js'
import { GuiControllers, GuiParameters, GuiControllerTypes } from "./model/GUI";
import { Subject, BehaviorSubject } from "rxjs";
import { PointsMaterial, MeshBasicMaterial, Material } from "three";

@Injectable()
export class CameraGuiService {

    private parameters: GuiParameters = {
        size: 0.01,
        opacity: 1,
        wireframe: true,
    };
    public controllers: Subject<GuiParameters> = new BehaviorSubject<GuiParameters>(this.parameters);

    // globle shared gui settings
    private gui: GUI = new dat.GUI();;
    
    private figureSize = this.gui
            .add(this.parameters, 'size')
            .min(0.001).max(1).step(0.001).name("Point Size").listen();
    private figureMaterial = this.gui
            .add(this.parameters, 'wireframe')
            .name('Wireframe').listen();
    private figureOpacity = this.gui
            .add(this.parameters, 'opacity')
            .min(0.1).max(1).step(0.1).name('Opacity').listen();

    constructor() {
        this.figureSize.onChange((value) => {
            this.parameters.size = value;
            this.controllers.next(this.parameters);
        });
        this.figureMaterial.onChange((value) => {
            this.parameters.wireframe = value;
            this.controllers.next(this.parameters);
        });
        this.figureOpacity.onChange((value) => {
            this.parameters.opacity = value;
            this.controllers.next(this.parameters);
        });
    }

    get getControllers(): GuiControllers {
        return {
            FigureMaterial: this.figureMaterial,
            FigureOpacity: this.figureOpacity,
            FigureSize: this.figureSize
        }
    }

    get getParameters(): GuiParameters {
        return this.parameters;
    }
    
}