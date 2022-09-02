import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivenessNudge } from './liveness.nudge';
import { IonicModule } from '@ionic/angular';
import { AppSharedVerihubsFaceInstructionModalWebModule } from '../../../modals/face-instruction/web/module';

@NgModule({
    declarations: [LivenessNudge],
    imports: [
        CommonModule,
        IonicModule,
        AppSharedVerihubsFaceInstructionModalWebModule,
    ],
    exports: [LivenessNudge],
})
export class AppSharedVerihubsLivenessNudgeWebModule {
}
