import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscriber } from '@ubud/sate';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter, take, tap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { VerihubsService } from '../../../services/verihubs.service';

export interface Result {
    path: string;
    safePath: SafeUrl;
    width: number;
    height: number;
}

@Component({
    template: ``,
})
export class LivenessNudgeBase implements OnInit, OnDestroy {
    @ViewChild('livenessWrapper') public wrapperTpl!: ElementRef;
    @ViewChild('canvasTpl') public canvasTpl!: ElementRef;
    @ViewChild('submissionCanvasTpl') public submissionCanvasTpl!: ElementRef;

    @Input() public color = 'primary';
    @Input() public name: string | undefined;

    @Output() public excepted: EventEmitter<void> = new EventEmitter<void>();
    @Output() public submitted: EventEmitter<{ base64: string, name: string }> = new EventEmitter<{ base64: string, name: string }>();

    protected readonly livenessSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public liveness$: Observable<boolean>;
    protected readonly livenessLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public livenessLoading$: Observable<boolean>;
    protected readonly livenessInstructionSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    public livenessInstruction$: Observable<string | null>;
    public livenessSubjectId: string | undefined | null;

    protected readonly resultSubject: BehaviorSubject<Result | null> = new BehaviorSubject<Result | null>(null);
    public result$: Observable<Result | null>;

    public constructor(
        protected verihubs: VerihubsService,
        protected subscriber: Subscriber,
        protected sanitizer: DomSanitizer,
        protected modalCtrl: ModalController,
    ) {
        this.liveness$ = this.livenessSubject.asObservable();
        this.livenessLoading$ = this.livenessLoadingSubject.asObservable();
        this.livenessInstruction$ = this.livenessInstructionSubject.asObservable();

        this.result$ = this.resultSubject.asObservable();
    }

    public async handleOpenInstruction() {
        // TODO:
    }

    public async handleOpenException() {
        // TODO:
    }

    public handleLiveness(): void {
        if (this.verihubs.liveness) {
            this.handleOpenInstruction().then();
        } else {
            this.handleCloseLiveness();
            this.excepted.emit();
            this.verihubs.handleExcepted();
        }
    }

    public clearStreams(): void {
    }

    public handleStart(): void {
    }

    public handleContinue(): void {
    }

    public handleReset(): void {
    }

    public handleResetLiveness(resetSubject?: boolean): void {
        if (resetSubject) {
            this.livenessSubjectId = null;
        }

        this.clearStreams();
        this.livenessLoadingSubject.next(false);
        this.livenessInstructionSubject.next(null);
        this.resultSubject.next(null);
        if (this.verihubs.liveness) {
            this.verihubs.liveness.closeWindow();
        }

        this.handleReset();
    }

    public handleCloseLiveness(): void {
        this.handleResetLiveness(true);
        this.livenessSubject.next(false);
    }

    public handleLivenessEvent(): void {
    }

    public handleResult(): void {
        this.subscriber.subscribe(
            this,
            this.result$.pipe(
                tap(result => {
                    if (result) {
                        const interval = setInterval(() => {
                            if (this.canvasTpl) {
                                const canvas = this.canvasTpl.nativeElement;
                                const context = canvas.getContext('2d');
                                const image = new Image();
                                image.src = result.path;
                                image.onload = () => {
                                    context.drawImage(image, 0, 0, result.width, result.height);
                                };
                                clearInterval(interval);
                            }
                        }, 1);
                    }
                }),
            ),
        );
    }

    public handleSubmit(): void {
        this.subscriber.subscribe(
            this,
            this.result$.pipe(
                filter(result => !!result),
                take(1),
                tap(result => {
                    if (result && this.submissionCanvasTpl) {
                        const canvas = this.submissionCanvasTpl.nativeElement;
                        const context = canvas.getContext('2d');
                        const image = new Image();
                        image.src = result.path;
                        image.onload = () => {
                            context.drawImage(image, 0, 0, result.width * 3, result.height * 3);

                            const url = canvas.toDataURL('image/jpeg', 0.5);
                            this.subscriber.subscribe(
                                this,
                                this.verihubs.name$.pipe(
                                    take(1),
                                    tap(name => {
                                        const data = {
                                            base64: url,
                                            name: name || 'Liveness-Verification-' + (this.livenessSubjectId || this.name) + '.jpg',
                                        };
                                        this.submitted.emit(data);
                                        this.verihubs.handleSubmitted(data);
                                        this.handleCloseLiveness();
                                    })
                                ),
                            );
                        };
                    }
                }),
            ),
        );
    }

    public ngOnInit(): void {
        this.subscriber.subscribe(
            this,
            this.verihubs.init$.pipe(
                tap(init => {
                    if (init) {
                        this.verihubs.initializeLiveness();
                        this.handleLivenessEvent();
                        this.handleResult();
                    } else {
                        this.handleCloseLiveness();
                    }
                }),
            ),
        );

        this.subscriber.subscribe(
            this,
            this.verihubs.start$.pipe(
                tap(start => {
                    if (start) {
                        this.handleLiveness();
                    } else {
                        this.handleCloseLiveness();
                    }
                }),
            ),
        );
    }

    public ngOnDestroy(): void {
        this.handleCloseLiveness();
        this.subscriber.flush(this);
    }
}
