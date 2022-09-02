import { EnumOption } from './enum-option';
import { NullEnumOption } from '../models/null-enum-option';

export enum MonthName {
    JANUARI = '1',
    FEBRUARI = '2',
    MARET = '3',
    APRIL = '4',
    MEI = '5',
    JUNI = '6',
    JULI = '7',
    AGUSTUS = '8',
    SEPTEMBER = '9',
    OKTOBER = '10',
    NOVEMBER = '11',
    DESEMBER = '12',
}

export namespace MonthName {
    export function getValues(): EnumOption<MonthName>[] {
        return [
            { id: MonthName.JANUARI, text: 'Januari' },
            { id: MonthName.FEBRUARI, text: 'Februari' },
            { id: MonthName.MARET, text: 'Maret' },
            { id: MonthName.APRIL, text: 'April' },
            { id: MonthName.MEI, text: 'Mei' },
            { id: MonthName.JUNI, text: 'Juni' },
            { id: MonthName.JULI, text: 'Juli' },
            { id: MonthName.AGUSTUS, text: 'Agustus' },
            { id: MonthName.SEPTEMBER, text: 'September' },
            { id: MonthName.OKTOBER, text: 'Oktober' },
            { id: MonthName.NOVEMBER, text: 'November' },
            { id: MonthName.DESEMBER, text: 'Desember' },
        ];
    }

    export function find(id: MonthName | string): EnumOption<MonthName> {
        const search = MonthName.getValues().find((item) => item.id === id.toString());

        return search ? search : new NullEnumOption();
    }
}
