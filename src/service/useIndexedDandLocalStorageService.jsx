import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';


const DB_NAME = 'glenn-app-store-db';
const STORE_NAME = ['categories', 'products', 'users'];


const DEFAULT_DATA = {
    'categories': [
        {name: 'Product'},
        {name: 'Services'},
    ],
    'users': [
        { 
            firstName: 'Glenn',
            lastName: 'Granada',
            email: 'glennmarkgranada@gmail.com',
            password: 'P@ssword1234',
            role: 'super-admin'
        },
        { 
            firstName: 'Glenn2',
            lastName: 'Granada2',
            email: 'glennmarkgranada2@gmail.com',
            password: 'P@ssword12345',
            role: 'super-admin'
        }
    ]
};

const useIndexedDBService = () => {
    function initLocalStorage () {
        STORE_NAME.forEach( d_i => { //default_item
            
            const localStorageItem = localStorage.getItem(d_i);

            // If not set, initialize it and set it in localStorage
            if (!localStorageItem) {
                
                console.log(typeof d_i, d_i, DEFAULT_DATA[d_i])
                if(DEFAULT_DATA[d_i]){
                    let d_d_arr = []; // default data array
                    DEFAULT_DATA[d_i].forEach(d_d => { // default__data
                        const uid = uuidv4();
                        let itemData = d_d;
                        itemData['_id'] = uid;
                        d_d_arr.push(itemData);
                        
                    })
                    localStorage.setItem(d_i, JSON.stringify(d_d_arr));
                }
                
            }
        })
    }
    async function openDatabase() {
        return await openDB(DB_NAME, 1, {
            upgrade(db) {
                // Create multiple object stores
                STORE_NAME.forEach(storeName => {
                    const store = db.createObjectStore(storeName);

                    if (DEFAULT_DATA[storeName]) {
                        DEFAULT_DATA[storeName].forEach(item => {
                            
                            const id = uuidv4();
                            item['id'] = id;
                            store.add(item, item.id);
                            if(storeName === 'users'){
                                store.createIndex('emailIndex', 'email', { unique: true });
                            }
                        });
                    }
                });
                // db.createObjectStore(STORE_NAME);
            },
        });
    }

    async function getItems(storeName) {
        const data = localStorage.getItem(storeName);
        let parsedData = JSON.parse(data);
        return parsedData || [];
    }


    async function addItem(storeName, item) {
        const data = localStorage.getItem(storeName);
        let parsedData = data ? JSON.parse(data) : [];
        const id = uuidv4();
        item['_id'] = id;
        parsedData.push(item);
        localStorage.setItem(storeName, JSON.stringify(parsedData));

        return true;
    }

    async function deleteItem(storeName, itemId) {
        const data = localStorage.getItem(storeName);
        let parsedData = data ? JSON.parse(data) : [];

        let cleanedData = parsedData.filter( item => {
            return item.__id !== itemId;
        })
        localStorage.setItem("products", JSON.stringify(cleanedData));
        return true;
    }

    // async function addItem(storeName, item) {
    //     const db = await openDatabase();
    //     const tx = db.transaction(storeName, 'readwrite');
    //     const store = tx.objectStore(storeName);
    //     const id = uuidv4();
    //     item['id'] = id;
    //     await store.add(item, item.id);
    //     await tx.done;
    // }

   

    // async function getItems(storeName) {
    //     console.log('storeName: ', storeName );
    //     const db = await openDatabase();
    //     const tx = db.transaction(storeName, 'readonly');
    //     const store = tx.objectStore(storeName);

    //     let data = await store.getAll();
    //     console.log(`${storeName} data: `, data)
    //     return data;
    // }


    async function updateItem(storeName, itemId, updatedItem) {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(updatedItem, itemId);
        await tx.done;
    }

    // async function deleteItem(storeName, itemId) {
    //     const db = await openDatabase();
    //     const tx = db.transaction(storeName, 'readwrite');
    //     const store = tx.objectStore(storeName);
    //     await store.delete(itemId);
    //     await tx.done;
    // }


    async function setUserAuth(username, password) {
        const db = await openDatabase();
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        await store.put({ username, password });
        await tx.done;
    }

    async function getUserAuth(email) {
        const data = localStorage.getItem('users');
        let parsedData = JSON.parse(data);
        let authUser = parsedData.filter(user => {
            return user.email == email;
        })
        console.log(authUser, 'authUser')
        return authUser[0];
    }

    return { openDatabase, initLocalStorage, addItem, getItems, setUserAuth,  getUserAuth, updateItem, deleteItem}
}

export default useIndexedDBService;