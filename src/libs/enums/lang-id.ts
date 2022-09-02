import { EnumOption } from './enum-option';
import { NullEnumOption } from '../models/null-enum-option';

export enum LangId {
    ID = 'id',
    EN_US = 'en-US',
}

export namespace LangId {
    export function getValues(): EnumOption<LangId>[] {
        return [
            { id: LangId.ID, text: 'Bahasa Indonesia' },
            { id: LangId.EN_US, text: 'English' },
        ];
    }

    export function find(id: LangId): EnumOption<LangId> {
        const search = LangId.getValues().find(item => item.id === id);

        return search || new NullEnumOption();
    }
}
