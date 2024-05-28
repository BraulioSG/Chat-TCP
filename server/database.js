const { getExistingItem, getExistingItemsWhere, deleteExistingItem, addNewItemTo, editExistingItem } = require("./filemanager");

const USER_PATH = "../DB/users.json"
const CHANNEL_PATH = "../DB/channels.json"


function signupUser(username, password) {
    return addNewItemTo(USER_PATH, "usr", {
        username,
        password,

        last_conn: {
            port: null,
            addr: null
        },

        requests: [],
        channels: []
    })
}

function login(username, password, connection) {
    const user = getExistingItemsWhere(USER_PATH, { username, password })[0];

    if (!user) return null;

    return user.id;
}

function addChannelToDb(name, coordinator) {
    return addNewItemTo(CHANNEL_PATH, 'ch', {
        name,
        coordinator,
        members: [],
        messages: [],
    })
}

function newMessage(channel, author, body) {
    let ch = getExistingItem(CHANNEL_PATH, channel);
    ch.messages.push({ author, body })

    editExistingItem(CHANNEL_PATH, channel, {
        messages: ch.messages
    })
}

