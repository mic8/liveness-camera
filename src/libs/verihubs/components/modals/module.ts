import { NgModule } from '@angular/core';
import { AppSharedVerihubsFaceInstructionModalModule } from './face-instruction/module';
import { AppSharedVerihubsExceptionModalModule } from './exception/module';

const MODULES: any[] = [
    AppSharedVerihubsFaceInstructionModalModule,
    AppSharedVerihubsExceptionModalModule,
];

@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
})
export class AppSharedVerihubsModalsModule {}
