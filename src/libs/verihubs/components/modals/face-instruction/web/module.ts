import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FaceInstructionModal } from './face-instruction.modal';

@NgModule({
    declarations: [FaceInstructionModal],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [FaceInstructionModal],
})
export class AppSharedVerihubsFaceInstructionModalWebModule {}
