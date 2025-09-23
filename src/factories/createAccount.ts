import type { Account } from '../models/models';

let nextId = 1;
export function createEmptyAccount(): Account {
    return {
        id: nextId++,
        labels: [],
        type: 'LDAP',
        login: '',
        password: null,
    };
}
