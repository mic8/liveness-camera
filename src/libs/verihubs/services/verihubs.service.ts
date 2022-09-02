import { Injectable } from '@angular/core';
import { VerihubsConfig } from '../configs/verihubs.config';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { VerihubsClient } from '../clients/verihubs.client';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let Verihubs: any;

@Injectable({
    providedIn: 'root',
})
export class VerihubsService {
    public liveness: any;

    private readonly initSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public init$: Observable<boolean>;

    private readonly startSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public start$: Observable<boolean>;

    private readonly exceptedSubject: Subject<void> = new Subject<void>();
    public excepted$: Observable<void>;

    private readonly submittedSubject: Subject<{ base64: string, name: string }> = new Subject();
    public submitted$: Observable<{ base64: string, name: string }>;

    private readonly disableLivenessSubject: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(false);
    public disableLiveness$: Observable<boolean | undefined>;

    private readonly nameSubject: BehaviorSubject<string | null | undefined> = new BehaviorSubject<string | null | undefined>(null);
    public name$: Observable<string | null | undefined>;

    public constructor(
        private config: VerihubsConfig, private client: VerihubsClient,
    ) {
        this.init$ = this.initSubject.asObservable();
        this.start$ = this.startSubject.asObservable();
        this.excepted$ = this.exceptedSubject.asObservable();
        this.submitted$ = this.submittedSubject.asObservable();
        this.disableLiveness$ = this.disableLivenessSubject.asObservable();
        this.name$ = this.nameSubject.asObservable();
    }

    public handleInit(init: boolean): void {
        this.initSubject.next(init);
    }

    public handleStart(start: boolean, disableLiveness?: boolean, name?: string): void {
        this.disableLivenessSubject.next(disableLiveness);
        this.nameSubject.next(name);
        this.startSubject.next(start);
    }

    public handleExcepted(): void {
        this.exceptedSubject.next();
    }

    public handleSubmitted(data: { base64: string, name: string }): void {
        this.submittedSubject.next(data);
    }

    public initializeLiveness(): void {
        const variables = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            see_straight: `Lihat ke depan`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            open_mouth: `Buka mulut`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            look_left: `Lihat ke kiri`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            look_right: `Lihat ke kanan`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            look_top: `Lihat ke atas`
        };

        const credential = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'App-ID': this.config.appId,
        };

        const win: any = window;

        try {
            const verihubs = new Verihubs('https://verihubs.kemnaker.go.id/sdk');
            verihubs.setVariables?.(variables);
            verihubs.setCredential?.(credential);
            verihubs.setTimeout?.(60000);
            verihubs.setTotalInstructions?.(3);
            verihubs.setAttribute?.(false);
            verihubs.setPassiveLiveness?.(false);

            this.liveness = verihubs;
        } catch (exception) {
            const verihubs = new win.Verihubs('https://verihubs.kemnaker.go.id/sdk');
            verihubs.setVariables?.(variables);
            verihubs.setCredential?.(credential);
            verihubs.setTimeout?.(60000);
            verihubs.setTotalInstructions?.(3);
            verihubs.setAttribute?.(false);
            verihubs.setPassiveLiveness?.(false);

            this.liveness = verihubs;
        }
    }
}
