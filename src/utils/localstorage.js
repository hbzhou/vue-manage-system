const db = {
    save(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    get(key, defaultValue = {}) {
        return JSON.parse(localStorage.getItem(key)) || defaultValue;
    },
    remove(key){
        localStorage.removeItem(key)
    },
    clear(){
        localStorage.clear()
    }

};


export default db;
