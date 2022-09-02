import { NgModule } from '@angular/core';
import { AppSharedVerihubsLivenessNudgeWebModule } from './web/module';
import { AppSharedVerihubsLivenessNudgeIonicModule } from './ionic/module';

const MODULES: any[] = [
    AppSharedVerihubsLivenessNudgeWebModule,
    AppSharedVerihubsLivenessNudgeIonicModule,
];

@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
})
export class AppSharedVerihubsLivenessNudgeModule {}
