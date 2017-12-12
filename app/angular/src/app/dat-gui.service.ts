import { Injectable } from "@angular/core";
import { GUI, GUIController } from 'dat-gui'

import * as dat from 'dat.gui/build/dat.gui.js'
import { GuiControllers, GuiParameters, GuiControllerTypes } from "./model/GUI";
import { Subject, BehaviorSubject } from "rxjs";
import { PointsMaterial, MeshBasicMaterial, Material } from "three";

@Injectable()
export class DatGuiService {

    private parameters: GuiParameters = {
        size: 0.01,
        opacity: 1,
        wireframe: true,
    };
    private _controllers: Subject<GuiParameters> = new BehaviorSubject<GuiParameters>(this.parameters);

    // globle shared gui settings
    private gui: GUI = new dat.GUI({
        autoPlace: false
    });
    
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
            this._controllers.next(this.parameters);
        });
        this.figureMaterial.onChange((value) => {
            this.parameters.wireframe = value;
            this._controllers.next(this.parameters);
        });
        this.figureOpacity.onChange((value) => {
            this.parameters.opacity = value;
            this._controllers.next(this.parameters);
        });
        setTimeout(() => {
            this.gui.close();
            this.gui.domElement.style.position = "absolute";
            this.gui.domElement.style.top = "0";
            this.gui.domElement.style.right = "0";
            document.getElementById("main-camera").style.position = "relative";
            document.getElementById("main-camera").appendChild(this.gui.domElement);
        })
    }

    get getControllers(): GuiControllers {
        return {
            FigureMaterial: this.figureMaterial,
            FigureOpacity: this.figureOpacity,
            FigureSize: this.figureSize
        }
    }

    setControlParams(parameters: GuiParameters) {
        this._controllers.next(parameters);
        this.parameters = parameters;
        setTimeout(() => {
            this.figureSize.setValue(parameters.size);
            this.figureMaterial.setValue(parameters.wireframe);
            this.figureOpacity.setValue(parameters.opacity);
        })
    }

    get controllers() {
        return this._controllers;
    }

    openGui() {
        this.gui.open();
    }

    closeGui() {
        this.gui.close();
    }

    get getParameters(): GuiParameters {
        return this.parameters;
    }
    
}