import { NgModule } from '@angular/core';
import { AppSharedVerihubsExceptionModalWebModule } from './web/module';
import { AppSharedVerihubsExceptionModalIonicModule } from './ionic/module';

const MODULES: any[] = [
    AppSharedVerihubsExceptionModalWebModule,
    AppSharedVerihubsExceptionModalIonicModule,
];

@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
})
export class AppSharedVerihubsExceptionModalModule {}
