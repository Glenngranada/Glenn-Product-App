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
        }
    ]
};

const useIndexedDBService = () => {
    async function openDatabase() {
        return await openDB(DB_NAME, 1, {
            upgrade(db) {
                // Create multiple object stores
                STORE_NAME.forEach(storeName => {
                    const store = db.createObjectStore(storeName);

                    if (DEFAULT_DATA[storeName]) {
                        DEFAULT_DATA[storeName].forEach(item => {
                            console.log(item, 'item')
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

    async function addItem(storeName, item) {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const id = uuidv4();
        item['id'] = id;
        await store.add(item, item.id);
        await tx.done;
    }

    async function getItems(storeName) {
        console.log('storeName: ', storeName );
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        let data = await store.getAll();
        console.log(`${storeName} data: `, data)
        return data;
    }


    async function updateItem(storeName, itemId, updatedItem) {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put(updatedItem, itemId);
        await tx.done;
    }

    async function deleteItem(storeName, itemId) {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.delete(itemId);
        await tx.done;
    }


    async function setUserAuth(username, password) {
        const db = await openDatabase();
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        await store.put({ username, password });
        await tx.done;
    }

    async function getUserAuth(email) {
        console.log(email, 'getUserAuth');
        const db = await openDatabase();
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        
        const index = store.index('emailIndex'); 
        console.log(store, 'store');
        return index.get(email);
    }

    return { openDatabase, addItem, getItems, setUserAuth,  getUserAuth, updateItem, deleteItem}
}

export default useIndexedDBService;



