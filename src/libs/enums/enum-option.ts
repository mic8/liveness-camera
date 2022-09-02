export interface EnumOption<T> {
    id: T | undefined;
    text: string | null;
    color?: string | null;
    logo?: string | null;
    textColor?: string | null;
    bgColor?: string | null;
    icon?: string | null;
    desc?: string | null;
    subtitle?: string | null;
    target?: string | null;
    image?: string | null;
    label?: string | null;
    name?: string | null;
}

export class EnumOptionClass<T> implements EnumOption<T> {
    id!: T;
    text!: string;
    name?: string;
}

export interface LinkEnumOption<T> extends EnumOption<T> {
    parent: string | null;
    target: string | null;
    subtitle?: string | null;
}
