import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaceInstructionModalBase } from '../face-instruction.modal.base';

@Component({
    selector: 'app-verihubs-face-instruction-modal-ionic',
    templateUrl: './face-instruction.modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaceInstructionModal extends FaceInstructionModalBase {
}
