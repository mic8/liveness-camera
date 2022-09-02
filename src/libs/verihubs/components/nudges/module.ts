import { NgModule } from '@angular/core';
import { AppSharedVerihubsLivenessNudgeModule } from './liveness/module';

const MODULES: any[] = [
    AppSharedVerihubsLivenessNudgeModule,
];

@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
})
export class AppSharedVerihubsNudgesModule {}
