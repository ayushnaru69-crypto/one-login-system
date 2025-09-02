// Simple IndexedDB wrapper for users table
const DB_NAME = 'OneLoginSystem';
const DB_VERSION = 1;
const STORE_NAME = 'users';

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'mobile' });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function getUser(mobile) {
    return openDB().then(db =>
        new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(mobile);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        })
    );
}

function addUser(user) {
    return openDB().then(db =>
        new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.add(user);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        })
    );
}

function hashPassword(password) {
    // SHA-256 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    return window.crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    });
}
