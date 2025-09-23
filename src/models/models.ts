export type AccountType = 'LDAP' | 'Локальная';

export interface LabelItem {
    text: string;
}

export interface Account {
    id: number;
    labels: LabelItem[];
    type: AccountType;
    login: string;
    password: string | null;
}

export const LABEL_MAX = 50;
export const LOGIN_MAX = 100;
export const PASSWORD_MAX = 100;
