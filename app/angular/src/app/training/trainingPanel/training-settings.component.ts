import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { TrainingSettings, LearningStrategy } from "../model/DataPreprocess";

@Component({
    selector: 'app-training-settings',
    templateUrl: 'training-settings.component.html',
    styles: [`
    :host {
        display:inline-flex;
    }
    `]
})
export class TrainingSettingsComponent implements OnChanges {

    @Input() devices;
    strategies = [LearningStrategy.TRAIN, LearningStrategy.TRANSFER_LEARNING];
    
    trainset = 80;
    strategy: string;
    device;
    learning_rate = 0.0005;
    keep_rate = 0.5;
    seed = 1000;
    epochs = 5;
    batch_size = 32;

    ngOnChanges() {

    }

    onSettings(): TrainingSettings {
        let st = this.strategy == LearningStrategy.TRAIN ? LearningStrategy.TRAIN : LearningStrategy.TRANSFER_LEARNING;
        let settings: TrainingSettings = {
            learning_rate: this.learning_rate,
            keep_rate: this.keep_rate,
            seed: this.seed,
            trainset: this.trainset,
            strategy: st,
            device: this.device,
            epochs: this.epochs,
            batch_size: this.batch_size
        }
        return settings;
    }

}