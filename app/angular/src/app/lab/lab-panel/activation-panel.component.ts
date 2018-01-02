import { Component, Output,EventEmitter } from "@angular/core";
import { MatSelectChange } from "@angular/material";

@Component({
    selector: 'app-activation-panel',
    templateUrl: 'activation-panel.component.html'
})
export class ActivationPanelComponent {

    @Output() activate = new EventEmitter<string>();

    activationFunctions = ['ReLU'];

    activation = this.activationFunctions[0];

    onSelected(e: MatSelectChange) {
        this.activation = e.value;
    }

    onActivate() {
        this.activate.emit(this.activation);
    }

}