import { defineStore } from 'pinia';
import type { Account } from 'src/models/models';
import { LOGIN_MAX, PASSWORD_MAX } from 'src/models/models';
import { parseLabels } from 'src/utils/parseLabels';

const STORAGE_KEY = 'accounts';

type ValidationErrors = Partial<Record<'login' | 'password', string>>;

function validateAccount(account: Account): { valid: boolean; errors: ValidationErrors } {
    const errors: ValidationErrors = {};

    if (!account.login || account.login.length === 0) {
        errors.login = 'Логин не может быть пустым';
    } else if (account.login.length > LOGIN_MAX) {
        errors.login = `Логин не может быть длиннее ${LOGIN_MAX} символов`;
    }

    if (account.type === 'Локальная') {
        if (!account.password || account.password.length === 0) {
            errors.password = 'Пароль не может быть пустым';
        } else if (account.password.length > PASSWORD_MAX) {
            errors.password = `Пароль не может быть длиннее ${PASSWORD_MAX} символов`;
        }
    }

    return { valid: Object.keys(errors).length === 0, errors: errors };
}

function loadFromStorage(): Account[] {
    try {
        const accountsJson = localStorage.getItem(STORAGE_KEY);
        if (!accountsJson) return [];
        const parsed = JSON.parse(accountsJson) as Account[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveToStorage(accounts: Account[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export const useAccountsStore = defineStore('accounts', {
    state: () => ({
        accounts: loadFromStorage(),
        nextId: 1 as number,
    }),
    actions: {
        addAccount(account: Account) {
            if (!this.nextId || this.nextId <= 1) {
                const maxId = this.accounts.reduce((m, a) => (a.id > m ? a.id : m), 0);
                this.nextId = maxId + 1;
            }
            account.id = this.nextId++;
            this.accounts.push(account);
            saveToStorage(this.accounts);
        },

        updateAccount(id: number, payload: Partial<Account> & { labelsString?: string }) {
            const index = this.accounts.findIndex((a) => a.id === id);
            if (index === -1) return;

            const existing = this.accounts[index];
            const merged: Account = {
                ...existing,
                ...payload,
            } as Account;

            if (payload.labelsString !== undefined) {
                merged.labels = parseLabels(payload.labelsString);
            }

            if (payload.type === 'LDAP') {
                merged.password = null;
            }

            const { valid } = validateAccount(merged);

            const payloadKeys = Object.keys(payload).filter((k) => k !== 'labelsString');
            const onlyLabelsChanged =
                payload.labelsString !== undefined && payloadKeys.length === 0;

            if (!valid && !onlyLabelsChanged) {
                return false;
            }

            this.accounts[index] = merged;

            if (valid || onlyLabelsChanged) {
                saveToStorage(this.accounts);
            }
            return true;
        },

        deleteAccount(id: number) {
            this.accounts = this.accounts.filter((a) => a.id !== id);
            saveToStorage(this.accounts);
        },

        checkAccount(id: number) {
            const acc = this.accounts.find((a) => a.id === id);
            if (!acc) return { valid: false, errors: { login: 'Не найдена запись' } };
            return validateAccount(acc);
        },
    },
});
