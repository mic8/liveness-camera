import { EnumOption } from './enum-option';
import { NullEnumOption } from '../models/null-enum-option';

export enum TermUnit {
    MONTH = 'month',
    YEAR = 'year',
}

export namespace TermUnit {
    export function getValues(): EnumOption<TermUnit>[] {
        return [
            {
                id: TermUnit.MONTH,
                text: 'bulan',
            },
            {
                id: TermUnit.YEAR,
                text: 'tahun',
            },
        ];
    }

    export function find(termUnit: TermUnit): EnumOption<TermUnit> {
        const search = TermUnit.getValues().find(item => {
            return termUnit === item.id;
        });

        return search ? search : new NullEnumOption();
    }
}
