import { EnumOption } from '../enums/enum-option';

export class NullEnumOption<T> implements EnumOption<T> {
    public id: T;
    public color: string;
    public text: string;

    public constructor() {
        this.id = <any>null;
        this.color = '';
        this.text = '';
    }
}
