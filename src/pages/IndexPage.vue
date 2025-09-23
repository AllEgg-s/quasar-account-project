<template>
    <q-page>
        <div class="page-container">
            <div class="row items-center justify-between q-mb-lg">
                <div class="text-h5">Учетные записи</div>
                <q-btn icon="add" color="primary" label="Добавить" @click="onAdd" />
            </div>

            <div class="glass-card q-pa-lg">
                <transition-group name="fade" tag="div">
                    <div
                        class="row q-col-gutter-md q-mb-md"
                        v-for="row in store.accounts"
                        :key="row.id"
                    >
                        <div class="col-12 col-md-4">
                            <q-input
                                class="glass-input"
                                v-model="labelsLocal[row.id]"
                                :maxlength="LABEL_MAX"
                                label="Метки через ;"
                                hint="Введите метки через ; (точка с запятой)"
                                bottom-slots
                                dense
                                lazy-rules
                                :rules="[
                                    (v) =>
                                        (v?.length ?? 0) <= LABEL_MAX ||
                                        `Максимум ${LABEL_MAX} символов`,
                                ]"
                                @blur="onLabelBlur(row)"
                                @keyup.enter="onLabelBlur(row)"
                            />
                        </div>
                        <div class="col-12 col-md-3">
                            <q-select
                                class="glass-input"
                                v-model="row.type"
                                :options="accountTypes"
                                label="Тип записи"
                                emit-value
                                map-options
                                dense
                                popup-content-class="select-popup"
                                @update:model-value="(val) => onTypeChange(row, val)"
                            />
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                class="glass-input"
                                v-model="row.login"
                                :maxlength="LOGIN_MAX"
                                label="Логин"
                                dense
                                lazy-rules
                                :rules="[
                                    (v) => !!v || 'Обязателен к заполнению',
                                    (v) =>
                                        (v?.length ?? 0) <= LOGIN_MAX ||
                                        `Максимум ${LOGIN_MAX} символов`,
                                ]"
                                @blur="onLoginBlur(row)"
                            />
                        </div>
                        <div class="col-12 col-md-2" v-if="row.type === 'Локальная'">
                            <q-input
                                class="glass-input"
                                v-model="row.password"
                                type="password"
                                :maxlength="PASSWORD_MAX"
                                label="Пароль"
                                dense
                                lazy-rules
                                :rules="[
                                    (v) => !!v || 'Обязателен для Локальная',
                                    (v) =>
                                        (v?.length ?? 0) <= PASSWORD_MAX ||
                                        `Максимум ${PASSWORD_MAX} символов`,
                                ]"
                                @blur="onPasswordBlur(row)"
                            />
                        </div>
                        <div class="col-12 col-md-12">
                            <q-btn
                                color="negative"
                                icon="delete"
                                label="Удалить"
                                flat
                                @click="onDelete(row)"
                            />
                        </div>
                        <q-separator class="col-12 card-sep" dark />
                    </div>
                </transition-group>

                <div v-if="store.accounts.length === 0" class="text-grey-5 q-mt-md">
                    Нет учетных записей
                </div>
            </div>
        </div>
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
</script>

<style></style>
