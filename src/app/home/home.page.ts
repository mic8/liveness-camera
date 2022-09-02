import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VerihubsService } from '../../libs/verihubs/services/verihubs.service';
import { Subscriber } from '@ubud/sate';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    private readonly imageSubject: BehaviorSubject<string | undefined | null> = new BehaviorSubject<string | undefined | null>(undefined);
    public image$: Observable<string | undefined | null> = this.imageSubject.asObservable();

    public constructor(
        public verihubs: VerihubsService,
        private subscriber: Subscriber,
    ) {
    }

    public ngOnInit(): void {
        this.verihubs.handleInit(true);

        this.subscriber.subscribe(
            this,
            this.verihubs.submitted$.pipe(
                tap(data => {
                    console.log(data);
                }),
            ),
        );
    }

    public ngOnDestroy(): void {
        this.subscriber.flush(this);
    }
}
