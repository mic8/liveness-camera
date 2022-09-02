import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { LivenessNudgeBase } from '../liveness.nudge.base';
import { FaceInstructionModal } from '../../../modals/face-instruction/ionic/face-instruction.modal';
import { ExceptionModal } from '../../../modals/exception/ionic/exception.modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscriber } from '@ubud/sate';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform } from '@ionic/angular';
import { filter, take, tap } from 'rxjs/operators';
import {
    CameraPreview,
    CameraPreviewOptions,
    CameraPreviewPictureOptions
} from '@awesome-cordova-plugins/camera-preview';
import { VerihubsService } from '../../../../services/verihubs.service';
import { VerihubsInstruction } from '../../../../enums/verihubs-instruction';

@Component({
    selector: 'app-verihubs-liveness-nudge-ionic',
    templateUrl: './liveness.nudge.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./liveness.nudge.scss'],
})
export class LivenessNudge extends LivenessNudgeBase {
    private readonly openCameraSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public openCamera$: Observable<boolean> = this.openCameraSubject.asObservable();
    private readonly openCameraLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public openCameraLoading$: Observable<boolean> = this.openCameraLoadingSubject.asObservable();
    private readonly cameraCanvasWidthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public cameraCanvasWidth$: Observable<number> = this.cameraCanvasWidthSubject.asObservable();
    private readonly cameraCanvasHeightSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public cameraCanvasHeight$: Observable<number> = this.cameraCanvasHeightSubject.asObservable();

    public rootApp = document.getElementById('app-root');

    public cameraWidth = 0;
    public cameraHeight = 0;

    public constructor(
        verihubs: VerihubsService,
        subscriber: Subscriber,
        sanitizer: DomSanitizer,
        modalCtrl: ModalController,
        private cdRef: ChangeDetectorRef,
        private zone: NgZone,
        private platform: Platform,
    ) {
        super(verihubs, subscriber, sanitizer, modalCtrl);
    }

    public override async handleOpenInstruction() {
        const modal = await this.modalCtrl.create({
            mode: 'ios',
            component: FaceInstructionModal,
            breakpoints: [0, 0.9, 1],
            initialBreakpoint: 1,
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
            breakpoints: [0, 0.9, 1],
            initialBreakpoint: 1,
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

    public override handleReset(): void {
        this.openCameraLoadingSubject.next(false);
        this.openCameraSubject.next(false);
        this.rootApp?.classList.remove('app-d-none');
        document.getElementById('liveness-loader')?.classList.add('hidden');
        document.getElementById('liveness-nudge')?.remove();
    }

    public handleGenerateOverlay(): void {
        const div = document.createElement('div');
        const html = `
        <div class="fixed top-0 left-0 right-0 m-auto text-center pb-12 pt-20" style="z-index: 9999999;">
          <h6 class="text-blank font-semibold" id="liveness-instruction"></h6>
        </div>
        <button class="m-0 h-10 w-10 fixed top-6 right-6 md:top-10 md:right-10 rounded-full bg-blank"
                style="z-index: 9999999;" id="liveness-close-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="feather feather-x"
                 style="display: inline-block;fill: none;height: 20px;stroke: black;
                 stroke-linecap: round;stroke-linejoin: round;stroke-width: 2px;
                 width: 20px;"
            >
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="fixed liveness rounded-xl">
            <div class="loader flex items-center justify-center hidden text-center" id="liveness-loader">
                <h6 class="text-blank font-semibold text-center">Sedang menyiapkan...</h6>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 m-auto text-center p-4" style="z-index: 9999999;">
            <div class="flex w-full h-full justify-center items-center space-x-3">
                <button class="h-10 text-sm font-bold bg-primary rounded-lg px-4 text-blank" id="liveness-start-button">
                    <span>Mulai Ambil Foto</span>
                </button>
            </div>
        </div>
        `;
        div.id = 'liveness-nudge';
        div.classList.add('liveness-wrapper');
        div.innerHTML = html;

        const parent = this.rootApp?.parentNode;
        if (parent) {
            parent.appendChild(div);
        }

        document.getElementById('liveness-close-button')?.addEventListener('click', () => {
            this.handleCloseLiveness();
            CameraPreview.stopCamera();
        });

        document.getElementById('liveness-start-button')?.addEventListener('click', () => {
            this.handleContinue();
        });
    }

    public override handleStart() {
        this.openCameraSubject.next(true);

        this.livenessSubject.next(true);
        this.livenessLoadingSubject.next(true);

        const interval = setInterval(() => {
            if (this.wrapperTpl) {
                clearInterval(interval);

                const x = this.wrapperTpl.nativeElement.offsetLeft;
                const y = this.wrapperTpl.nativeElement.offsetTop;
                const width = this.wrapperTpl.nativeElement.offsetWidth;
                const height = this.wrapperTpl.nativeElement.offsetHeight;

                this.cameraCanvasWidthSubject.next(width);
                this.cameraCanvasHeightSubject.next(height);

                this.rootApp?.classList.add('app-d-none');
                this.handleGenerateOverlay();

                document.getElementById('liveness-loader')?.classList.remove('hidden');

                const cameraPreviewOpts: CameraPreviewOptions = {
                    x,
                    y,
                    width,
                    height,
                    camera: 'front',
                    tapPhoto: true,
                    previewDrag: false,
                    toBack: true,
                    alpha: 1,
                    storeToFile: false,
                    tapFocus: true,
                };

                CameraPreview.startCamera(cameraPreviewOpts).then(
                    () => {
                        document.getElementById('liveness-loader')?.classList.add('hidden');

                        this.openCameraSubject.next(true);
                        this.openCameraLoadingSubject.next(false);

                        this.cameraWidth = width;
                        this.cameraHeight = height;

                        this.platform.backButton.subscribeWithPriority(10, () => {
                            CameraPreview.stopCamera();
                            this.handleCloseLiveness();
                        });
                    },
                    () => {
                        CameraPreview.stopCamera();
                        this.handleCloseLiveness();
                        this.handleOpenException().then();
                    },
                );
            }
        }, 1);
    }

    public override handleContinue(): void {
        this.subscriber.subscribe(
            this,
            this.verihubs.disableLiveness$.pipe(
                take(1),
                tap(disable => {
                    if (!disable) {
                        this.livenessSubject.next(true);
                        this.openCameraLoadingSubject.next(true);
                        document.getElementById('liveness-loader')?.classList.remove('hidden');
                        this.zone.run(() => {
                            this.verihubs.liveness.verifyLiveness();
                        });
                    } else {
                        const pictureOpts: CameraPreviewPictureOptions = {
                            width: this.cameraWidth,
                            height: this.cameraHeight,
                            quality: 85
                        };

                        CameraPreview.takePicture(pictureOpts).then((imageData) => {
                            const picture = 'data:image/jpeg;base64,' + imageData;

                            this.livenessLoadingSubject.next(false);
                            this.handleReset();
                            CameraPreview.stopCamera();

                            this.resultSubject.next({
                                path: picture,
                                safePath: this.sanitizer.bypassSecurityTrustUrl(picture),
                                width: this.cameraWidth,
                                height: this.cameraHeight,
                            });
                        }, () => {
                            CameraPreview.stopCamera();
                            this.handleCloseLiveness();
                            this.handleOpenException().then();
                        });
                    }
                })
            ),
        );
    }

    public override handleLivenessEvent(): void {
        window.addEventListener('message', (data) => {
            switch (data.data.status) {
                case 100:
                    this.zone.run(() => {
                        document.getElementById('liveness-loader')?.classList.add('hidden');
                        this.openCameraLoadingSubject.next(false);
                        this.openCameraSubject.next(false);
                        this.livenessLoadingSubject.next(false);
                        this.livenessInstructionSubject.next(VerihubsInstruction.find(data?.data?.instruction.toUpperCase())?.text);
                        this.cdRef.markForCheck();
                    });
                    break;
                case 200:
                    this.zone.run(() => {
                        this.clearStreams();
                        this.handleReset();
                        CameraPreview.stopCamera();
                        this.livenessLoadingSubject.next(false);
                        this.livenessInstructionSubject.next(null);

                        if (this.verihubs.liveness) {
                            this.verihubs.liveness.closeWindow();
                        }

                        if (this.wrapperTpl) {
                            const width = this.wrapperTpl.nativeElement.offsetWidth;
                            const height = this.wrapperTpl.nativeElement.offsetHeight;

                            this.resultSubject.next({
                                path: `data:image/png;base64, ${ data.data.base64String_1 }`,
                                safePath: this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64, ${ data.data.base64String_1 }`),
                                width,
                                height,
                            });

                            this.cdRef.markForCheck();
                        }
                    });
                    break;
                case 400:
                case 401:
                case 406:
                case 408:
                case 500:
                    this.zone.run(() => {
                        CameraPreview.stopCamera();
                        this.handleCloseLiveness();
                        this.handleOpenException().then();

                        this.cdRef.markForCheck();
                    });
                    break;
            }
        });
    }

    public override handleResult() {
        // TODO: Silent is gold
        this.subscriber.subscribe(
            this,
            this.livenessInstruction$.pipe(
                tap(instruction => {
                    if (instruction) {
                        const el = document.getElementById('liveness-instruction');
                        if (el) {
                            el.innerHTML = instruction;
                        }
                    }
                })
            ),
        );
    }

    public override handleSubmit() {
        this.subscriber.subscribe(
            this,
            this.result$.pipe(
                filter(result => !!result),
                take(1),
                tap(result => {
                    if (result) {
                        this.subscriber.subscribe(
                            this,
                            this.verihubs.name$.pipe(
                                take(1),
                                tap(name => {
                                    const data = {
                                        base64: result.path,
                                        name: name || 'Liveness-Verification-' + (this.livenessSubjectId || this.name) + '.jpg',
                                    };
                                    this.submitted.emit(data);
                                    this.verihubs.handleSubmitted(data);
                                    this.handleCloseLiveness();
                                    CameraPreview.stopCamera();
                                })
                            ),
                        );
                    }
                }),
            ),
        );
    }
}
