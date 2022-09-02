import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExceptionModal } from './exception.modal';

@NgModule({
    declarations: [ExceptionModal],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [ExceptionModal],
})
export class AppSharedVerihubsExceptionModalIonicModule {}
