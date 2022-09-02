import { EnumOption } from '../../enums/enum-option';
import { NullEnumOption } from '../../models/null-enum-option';

export enum VerihubsInstruction {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FRONT = 'HEAD_STRAIGHT',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TOP = 'HEAD_LOOK_UP',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LEFT = 'HEAD_LOOK_LEFT',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RIGHT = 'HEAD_LOOK_RIGHT',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MOUTH = 'OPEN_MOUTH',
}

export namespace VerihubsInstruction {
    export function getValues(): EnumOption<VerihubsInstruction>[] {
        return [
            { id: <any>null, text: `Arahkan kamera ke arah wajah` },
            { id: VerihubsInstruction.FRONT, text: `Lihat ke depan` },
            { id: VerihubsInstruction.TOP, text: `Lihat ke atas` },
            { id: VerihubsInstruction.LEFT, text: `Lihat ke kiri` },
            { id: VerihubsInstruction.RIGHT, text: `Lihat ke kanan` },
            { id: VerihubsInstruction.MOUTH, text: `Buka mulut` },
        ];
    }

    export function find(id: VerihubsInstruction | any): EnumOption<VerihubsInstruction> {
        const search = VerihubsInstruction.getValues().find(item => item.id === id);

        return search || new NullEnumOption();
    }
}
