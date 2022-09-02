import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { LivenessNudgeBase, Result } from '../liveness.nudge.base';
import { FaceInstructionModal } from '../../../modals/face-instruction/web/face-instruction.modal';
import { ExceptionModal } from '../../../modals/exception/web/exception.modal';
import { take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { VerihubsInstruction } from '../../../../enums/verihubs-instruction';

@Component({
    selector: 'app-verihubs-liveness-nudge-web',
    templateUrl: './liveness.nudge.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./liveness.nudge.scss'],
})
export class LivenessNudge extends LivenessNudgeBase {
    @ViewChild('cameraTpl') public cameraTpl!: ElementRef;
    @ViewChild('cameraCanvasTpl') public cameraCanvasTpl!: ElementRef;

    private readonly videoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public video$: Observable<boolean> = this.videoSubject.asObservable();
    public streams: any;

    private readonly videoWidthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(650);
    public videoWidth$: Observable<number> = this.videoWidthSubject.asObservable();
    private readonly videoHeightSubject: BehaviorSubject<number> = new BehaviorSubject<number>(450);
    public videoHeight$: Observable<number> = this.videoHeightSubject.asObservable();
    private readonly videoResultSubject: BehaviorSubject<Result | null> = new BehaviorSubject<Result | null>(null);
    public videoResult$: Observable<Result | null> = this.videoResultSubject.asObservable();
    private readonly videoLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public videoLoading$: Observable<boolean> = this.videoLoadingSubject.asObservable();

    public override async handleOpenInstruction() {
        const modal = await this.modalCtrl.create({
            mode: 'ios',
            component: FaceInstructionModal,
            cssClass: 'web-modal modal-rounded',
            componentProps: {
                color: this.color,
            },
        });

        await modal.present();

        await modal.onDidDismiss().then(({ data }) => {
            if (data) {
                const { intent } = data;
                if (intent) {
                    this.handleStart();
                }
            }
        });
    }

    public override async handleOpenException() {
        const modal = await this.modalCtrl.create({
            mode: 'ios',
            component: ExceptionModal,
            cssClass: 'web-modal modal-rounded',
            componentProps: {
                color: this.color,
            },
        });

        await modal.present();

        await modal.onDidDismiss().then(({ data }) => {
            if (data) {
                const { intent } = data;
                if (intent) {
                    this.handleStart();
                }
            }
        });
    }

    public override handleContinue(): void {
        this.subscriber.subscribe(
            this,
            this.verihubs.disableLiveness$.pipe(
                take(1),
                tap(disable => {
                    if (!disable) {
                        this.livenessSubject.next(true);
                        this.videoLoadingSubject.next(true);
                        this.verihubs.liveness.verifyLiveness();
                    } else {
                        if (this.cameraCanvasTpl && this.cameraTpl) {
                            const canvas = this.handleExtractVideo();
                            const url = canvas.toDataURL('image/jpeg', 0.5);

                            this.resultSubject.next({
                                path: url,
                                safePath: this.sanitizer.bypassSecurityTrustUrl(url),
                                width: canvas.width,
                                height: canvas.height,
                            });

                            this.clearStreams();
                            this.videoLoadingSubject.next(false);
                            this.videoSubject.next(false);
                        }
                    }
                })
            ),
        );
    }

    public handleExtractVideo(): HTMLCanvasElement {
        const capture = this.cameraTpl.nativeElement;
        const canvas = this.cameraCanvasTpl.nativeElement;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(capture, 0, 0, canvas.width, canvas.height);

        return canvas;
    }

    public override clearStreams(): void {
        this.streams?.getTracks().forEach((track: { stop: () => any }) => track.stop());
    }

    public override handleReset(): void {
        this.videoLoadingSubject.next(false);
        this.videoSubject.next(false);
        this.videoResultSubject.next(null);
    }

    public handleSetVideoSize(data: any): void {
        const el = data.target;

        const width = el.videoWidth;
        const height = el.videoHeight;

        const scale = 650 / width;

        this.videoWidthSubject.next(width * scale);
        this.videoHeightSubject.next(height * scale);
    }

    public override handleStart(): void {
        const constraints = {
            audio: false,
            video: {
                facingMode: 'environment'
            }
        };

        constraints.video.facingMode = 'user';

        this.livenessSubject.next(true);
        this.livenessLoadingSubject.next(true);

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                this.videoSubject.next(true);

                const interval = setInterval(() => {
                    if (this.cameraTpl) {
                        setTimeout(() => {
                            this.livenessLoadingSubject.next(false);
                        }, 200);
                        this.cameraTpl.nativeElement.srcObject = stream;
                        this.streams = stream;
                        clearInterval(interval);
                    }
                }, 1);
            })
            .catch(error => {
                this.handleCloseLiveness();
                this.handleOpenException().then();
            });
    }

    public override handleLivenessEvent(): void {
        window.addEventListener('message', (data) => {
            switch (data.data.status) {
                case 100:
                    this.clearStreams();
                    this.videoLoadingSubject.next(false);
                    this.videoSubject.next(false);
                    this.livenessLoadingSubject.next(false);
                    this.livenessInstructionSubject.next(VerihubsInstruction.find(data?.data?.instruction.toUpperCase())?.text);
                    break;
                case 200:
                    this.clearStreams();
                    this.videoLoadingSubject.next(false);
                    this.videoSubject.next(false);
                    this.livenessLoadingSubject.next(true);
                    this.livenessInstructionSubject.next(null);

                    this.subscriber.subscribe(
                        this,
                        this.videoResult$.pipe(
                            take(1),
                            tap(videoResult => {
                                this.livenessLoadingSubject.next(false);
                                this.livenessSubjectId = `Subject-${Math.random()}`;

                                if (videoResult) {
                                    this.resultSubject.next(videoResult);
                                } else {
                                    this.resultSubject.next({
                                        path: `data:image/png;base64, ${ data.data.base64String_1 }`,
                                        safePath: this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64, ${ data.data.base64String_1 }`),
                                        width: this.videoWidthSubject.value,
                                        height: this.videoHeightSubject.value,
                                    });
                                }
                            }),
                        ),
                    );
                    break;
                case 400:
                case 401:
                case 406:
                case 408:
                case 500:
                    this.handleCloseLiveness();
                    this.handleOpenException().then();
                    break;
            }
        });
    }
}
