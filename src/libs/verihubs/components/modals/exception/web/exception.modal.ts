import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExceptionModalBase } from '../exception.modal.base';

@Component({
    selector: 'app-verihubs-exception-modal-web',
    templateUrl: './exception.modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExceptionModal extends ExceptionModalBase {
}
