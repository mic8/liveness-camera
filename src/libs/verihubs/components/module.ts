import { NgModule } from '@angular/core';
import { AppSharedVerihubsNudgesModule } from './nudges/module';
import { AppSharedVerihubsModalsModule } from './modals/module';

const MODULES: any[] = [
    AppSharedVerihubsNudgesModule,
    AppSharedVerihubsModalsModule,
];

@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
})
export class AppSharedVerihubsComponentsModule {}
