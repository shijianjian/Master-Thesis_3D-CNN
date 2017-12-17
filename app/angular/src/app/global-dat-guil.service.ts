import { Injectable } from "@angular/core";

import * as dat from 'dat.gui/build/dat.gui.js'
import { GUI } from 'dat-gui'

@Injectable()
export class GlobalDatGuiService {

    // globle shared gui settings
    private gui: GUI = new dat.GUI({
        autoPlace: false
    });

    get globalGui(): GUI {
        return this.gui;
    }

    reset(): void {
        this.gui.destroy();
        this.gui = new dat.GUI({
            autoPlace: false
        });
    }
    
}