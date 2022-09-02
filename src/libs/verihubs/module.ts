import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { VerihubsConfig } from './configs/verihubs.config';
import { VerihubsService } from './services/verihubs.service';
import { VerihubsClient } from './clients/verihubs.client';

@NgModule({
    providers: [VerihubsService],
})
export class AppSharedVerihubsModule {
    public static forRoot(config: VerihubsConfig, client?: Type<VerihubsClient>): ModuleWithProviders<AppSharedVerihubsModule> {
        return {
            ngModule: AppSharedVerihubsModule,
            providers: [
                {
                    provide: VerihubsConfig,
                    useValue: config,
                },
                {
                    provide: VerihubsClient,
                    useClass: client || VerihubsClient,
                },
            ],
        };
    }
}
