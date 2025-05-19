import { makeRequest } from "@/requests/requests";
import axios from "axios";
import { defineStore } from "pinia"
import { ref, watchEffect } from "vue"

export const useUserStore = defineStore('users', () => {
    const endpoint = 'users'

    const users = ref([]);
    const searchQuery = ref('');
    const idToDelete = ref(null);
    const userToEdit = ref(null);


    const getUsers = async () => {
        try {
            const res = await makeRequest(endpoint , 'GET');
            if (res.data) {
            users.value = res.data

            }
        } catch (error) {
            console.log('Error in user store', error);
        }
    }

    const addEditUser = async (form) => {
        console.log(form)
        try {
            let res;
            if(userToEdit.value)
            {
                res = await makeRequest(endpoint , 'PUT' , form , {} , {} , 0 , userToEdit.value.id); 
            }
            else res = await makeRequest(endpoint , 'POST' , form);

            return res;
        } catch (error) {
            console.log('Error in user store' , error);
        }
    }

    const deleteUser = async () => {
        try {
            
            if(idToDelete.value)
            {
                const res = await makeRequest(endpoint , 'DELETE' , {} , {} , {} , 0 , idToDelete.value); 
                if(res)
                {

                    return res;
                }
            }
        } catch (error) {
            console.log('Error in user store' , error);
        }
    }

    getUsers();

    return {
        getUsers,
        searchQuery,
        users,
        idToDelete,
        userToEdit,
        addEditUser,
        deleteUser
    }
})