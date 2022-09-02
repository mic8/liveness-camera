import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivenessNudge } from './liveness.nudge';
import { IonicModule } from '@ionic/angular';
import { AppSharedVerihubsFaceInstructionModalIonicModule } from '../../../modals/face-instruction/ionic/module';
import { AppSharedVerihubsExceptionModalIonicModule } from '../../../modals/exception/ionic/module';

@NgModule({
    declarations: [LivenessNudge],
    imports: [
        CommonModule,
        IonicModule,

        AppSharedVerihubsFaceInstructionModalIonicModule,
        AppSharedVerihubsExceptionModalIonicModule,
    ],
    exports: [LivenessNudge],
})
export class AppSharedVerihubsLivenessNudgeIonicModule {
}
