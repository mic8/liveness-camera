import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppSharedVerihubsModule } from '../libs/verihubs/module';
import { environment } from '../environments/environment';
import { AppSharedVerihubsComponentsModule } from '../libs/verihubs/components/module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            mode: 'ios',
            backButtonText: ''
        }),
        AppRoutingModule,

        AppSharedVerihubsModule.forRoot(
            {
                appId: environment.verihubs.appId,
            },
        ),
        AppSharedVerihubsComponentsModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
