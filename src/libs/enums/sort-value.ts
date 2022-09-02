import { EnumOption } from '@sisnaker/shared';

export enum SortValue {
    ASC = 'asc',
    DESC = 'desc',
}

export namespace SortValue {
    export function getValues(): EnumOption<SortValue>[] {
        return [
            { id: SortValue.ASC, text: 'Terdahulu' },
            { id: SortValue.DESC, text: 'Terbaru' },
        ];
    }
}
