import { NgModule } from '@angular/core';
import { AppSharedVerihubsFaceInstructionModalWebModule } from './web/module';
import { AppSharedVerihubsFaceInstructionModalIonicModule } from './ionic/module';

const MODULES: any[] = [
    AppSharedVerihubsFaceInstructionModalWebModule,
    AppSharedVerihubsFaceInstructionModalIonicModule,
];

@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
})
export class AppSharedVerihubsFaceInstructionModalModule {}
