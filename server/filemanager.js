const fs = require('node:fs');

function parseId(num) {
    if (num < 10) {
        return `00${num}`;
    }
    if (num < 100) {
        return `0${num}`;
    }
    return num.toString();
}

function addNewItemTo(filename, idPrefix, obj) {
    const exists = fs.existsSync(filename);

    if (!exists) return null;

    const data = fs.readFileSync(filename);
    const json = JSON.parse(data);


    let newId = "000";
    if (json.length <= 0) {
        newId = "001";
    }
    else {
        const lastIdx = json[json.length - 1].id;
        const idxNum = lastIdx.split("-")[1];
        newId = parseId(parseInt(idxNum) + 1);
    }

    obj.id = `${idPrefix}-${newId}`

    json.push(obj);

    fs.writeFileSync(filename, JSON.stringify(json), "ascii");


    return obj.id;
}

function editExistingItem(filename, id, obj) {
    const exists = fs.existsSync(filename);

    if (!exists) return null;

    const data = fs.readFileSync(filename);
    const json = JSON.parse(data);

    for (let i = 0; i < json.length; i++) {
        const item = json[i];

        if (item.id === id) {
            json[i] = { ...item, ...obj };
            break;
        }
    }
    fs.writeFileSync(filename, JSON.stringify(json), "utf8");
}

function getExistingItem(filename, id) {
    const exists = fs.existsSync(filename);

    if (!exists) return null;

    const data = fs.readFileSync(filename);
    const json = JSON.parse(data);

    return json.filter(item => item.id === id)[0];
}

function deleteExistingItem(filename, id) {
    const exists = fs.existsSync(filename);

    if (!exists) return null;

    const data = fs.readFileSync(filename);
    const json = JSON.parse(data);

    const result = json.filter(item => item.id !== id);
    fs.writeFileSync(filename, JSON.stringify(result), "utf8");


}

function getExistingItemsWhere(filename, query) {
    const exists = fs.existsSync(filename);

    if (!exists) return null;

    const data = fs.readFileSync(filename);
    const json = JSON.parse(data);

    const keys = Object.keys(query);

    const result = json.filter(item => {
        valid = true;

        keys.forEach(key => {
            if (item[key] !== query[key]) {
                valid = false;
                return;
            }
        })

        return valid;
    });
    return result;
}

function getAllCollection(filename) {
    const exists = fs.existsSync(filename);

    if (!exists) return null;

    const data = fs.readFileSync(filename);
    const json = JSON.parse(data);

    return json;
}

module.exports = {
    addNewItemTo,
    editExistingItem,
    getExistingItem,
    deleteExistingItem,
    getExistingItemsWhere,
    getAllCollection,
}