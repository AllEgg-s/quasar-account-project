<template>
    <q-page>
        <div class="flex justify-between items-center">
            <h1>Учетные записи</h1>
            <q-btn icon="add" color="primary" @click="addNewAccount"> </q-btn>
        </div>
        <q-table :rows="accounts" :columns="columns" row-key="id" flat bordered>
            <template #body="props">
                <q-tr :props="props">
                    <q-td>
                        <q-input :maxlength="50" v-model="props.row.label" />
                    </q-td>
                    <q-td>
                        <q-select
                            v-model="props.row.type"
                            :options="accountTypes"
                            emit-value
                            map-options
                        />
                    </q-td>
                    <q-td>
                        <q-input
                            v-model="props.row.login"
                            :maxlength="100"
                            :rules="[(val) => !!val || 'Обязателен к заполнению']"
                        />
                    </q-td>
                    <q-td>
                        <q-input
                            v-if="props.row.type === 'Локальная'"
                            v-model="props.row.password"
                            type="password"
                            :rules="[(val) => !!val || 'Обязателен к заполнению']"
                            :maxlength="100"
                        />
                    </q-td>
                    <q-td>
                        <q-btn icon="delete" @click="deleteRow(props.row)"></q-btn>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type Account = {
    id: number;
    label: string;
    type: string;
    login: string;
    password: string;
};

const accounts = ref<Account[]>([
    { id: 1, label: 'Метки через ;', type: 'LDAP', login: 'login', password: '' },
    { id: 2, label: 'Метки через ;', type: 'Локальная', login: 'user2', password: 'pass123' },
]);
const columns = ref([
    { name: 'label', label: 'Метки через ;', field: 'label' },
    { name: 'type', label: 'Тип', field: 'type' },
    { name: 'login', label: 'Логин', field: 'login' },
    { name: 'password', label: 'Пароль', field: 'password' },
]);

const accountTypes = ref(['LDAP', 'Локальная']);

const deleteRow = (row: Account) => {
    accounts.value = accounts.value.filter((accounts) => accounts.id !== row.id);
};

const addNewAccount = () => {
    const newAccount: Account = {
        id: accounts.value.length++,
        label: '',
        type: '',
        login: '',
        password: '',
    };
    accounts.value.push(newAccount);
};
</script>

<style></style>
