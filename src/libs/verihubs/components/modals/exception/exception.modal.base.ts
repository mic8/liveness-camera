import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    template: ``,
})
export class ExceptionModalBase {
    @Input() public color = 'primary';

    public constructor(
        private modalController: ModalController,
    ) {}

    public close(): void {
        this.modalController.dismiss();
    }

    public intent(): void {
        this.modalController.dismiss({
            intent: true,
        });
    }
}
