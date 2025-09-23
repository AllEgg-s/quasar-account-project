<template>
    <q-page>
        <div class="flex justify-between items-center">
            <h1>Учетные записи</h1>
            <q-btn icon="add" color="primary" @click="onAdd"> </q-btn>
        </div>
        <q-table
            :rows="store.accounts"
            :columns="columns"
            row-key="id"
            flat
            bordered
            no-data-label="Нет учетных записей"
        >
            <template #body="props">
                <q-tr :props="props">
                    <q-td>
                        <q-input
                            v-model="labelsLocal[props.row.id]"
                            :maxlength="LABEL_MAX"
                            hint="Введите метки через ; (точка с запятой)"
                            bottom-slots
                            lazy-rules
                            :rules="[
                                (v) =>
                                    (v?.length ?? 0) <= LABEL_MAX ||
                                    `Максимум ${LABEL_MAX} символов`,
                            ]"
                            @blur="onLabelBlur(props.row)"
                        />
                    </q-td>
                    <q-td>
                        <q-select
                            v-model="props.row.type"
                            :options="accountTypes"
                            emit-value
                            map-options
                            @update:model-value="(val) => onTypeChange(props.row, val)"
                        />
                    </q-td>
                    <q-td>
                        <q-input
                            v-model="props.row.login"
                            :maxlength="LOGIN_MAX"
                            lazy-rules
                            :rules="[
                                (v) => !!v || 'Обязателен к заполнению',
                                (v) =>
                                    (v?.length ?? 0) <= LOGIN_MAX ||
                                    `Максимум ${LOGIN_MAX} символов`,
                            ]"
                            @blur="onLoginBlur(props.row)"
                        />
                    </q-td>
                    <q-td>
                        <q-input
                            v-if="props.row.type === 'Локальная'"
                            v-model="props.row.password"
                            type="password"
                            :maxlength="PASSWORD_MAX"
                            lazy-rules
                            :rules="[
                                (v) => !!v || 'Обязателен для Локальная',
                                (v) =>
                                    (v?.length ?? 0) <= PASSWORD_MAX ||
                                    `Максимум ${PASSWORD_MAX} символов`,
                            ]"
                            @blur="onPasswordBlur(props.row)"
                        />
                    </q-td>
                    <q-td>
                        <q-btn icon="delete" @click="onDelete(props.row)"></q-btn>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </q-page>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useAccountsStore } from 'src/stores/account-store';
import { createEmptyAccount } from 'src/factories/createAccount';
import { labelsToString } from 'src/utils/labelsToString';
import { LABEL_MAX, LOGIN_MAX, PASSWORD_MAX } from 'src/models/models';
import type { Account, AccountType } from 'src/models/models';

const store = useAccountsStore();
const accountTypes = ['LDAP', 'Локальная'];

const labelsLocal = reactive<Record<number, string>>({});

function ensureLabelStringFor(id: number, labels: { text: string }[]) {
    labelsLocal[id] = labelsToString(labels);
}

onMounted(() => {
    store.accounts.forEach((a) => {
        ensureLabelStringFor(a.id, a.labels);
    });
});

function onAdd() {
    const emptyacc = createEmptyAccount();
    store.addAccount(emptyacc);
    ensureLabelStringFor(emptyacc.id, emptyacc.labels);
}

function onDelete(row: { id: number }) {
    store.deleteAccount(row.id);
    delete labelsLocal[row.id];
}

function onLabelBlur(row: Account) {
    const value = labelsLocal[row.id] ?? '';
    store.updateAccount(row.id, { labelsString: value });
}
function onTypeChange(row: Account, val: AccountType) {
    store.updateAccount(row.id, { type: val });
}
function onLoginBlur(row: Account) {
    store.updateAccount(row.id, { login: row.login });
}
function onPasswordBlur(row: Account) {
    store.updateAccount(row.id, { password: row.password ?? '' });
}

const columns = [
    { name: 'label', label: 'Метки через ;', field: 'labels' },
    { name: 'type', label: 'Тип', field: 'type' },
    { name: 'login', label: 'Логин', field: 'login' },
    { name: 'password', label: 'Пароль', field: 'password' },
    { name: 'actions', label: '', field: 'actions' },
];
</script>

<style></style>
