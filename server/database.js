const { getExistingItem, getExistingItemsWhere, deleteExistingItem, addNewItemTo, editExistingItem, getAllCollection } = require("./filemanager");

const USER_PATH = "../DB/users.json"
const CHANNEL_PATH = "../DB/channels.json"


function signupUser(username, password) {
    return addNewItemTo(USER_PATH, "usr", {
        username,
        password,
        requests: [],
        channels: []
    })
}

function login(username, password) {
    const user = getExistingItemsWhere(USER_PATH, { username })[0];

    if (!user) return [];
    if (user.password !== password) {
        return null;
    }

    return user.id;
}

function getUserInformation(id, type) {
    let user = getExistingItemsWhere(USER_PATH, { id })[0];

    if (!user) return null;

    switch (type) {
        case "info":
            return user;
        case "chns":
            return user.channels;
        case "reqs":
            return user.requests;
    }
}

function getChannelInformation(channel, type) {
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!ch) return null;

    switch (type) {
        case "info":
            return ch;
        case "msgs":
            return ch.messages;
        case "reqs":
            return ch.requests.map(req => {
                const usr = getUserInformation(req, "info");
                return { channel: ch, user: usr }
            });
        case "mems":
            return ch.members;
    }
}

function addChannelToDb(name, coordinator) {
    return addNewItemTo(CHANNEL_PATH, 'ch', {
        name,
        coordinator,
        members: [],
        messages: [],
        requests: []
    })
}

function newRequestToJoin(channel, id) {
    let user = getExistingItem(USER_PATH, id);
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!user || !ch) return null;
    user.requests.push(channel)
    ch.requests.push(id)
    editExistingItem(USER_PATH, id, {
        requests: user.requests
    })
    editExistingItem(CHANNEL_PATH, channel, {
        requests: ch.requests
    })
    return { channel, user }
}

function expelUser(channel, id) {
    let u = getExistingItemsWhere(USER_PATH, { id })[0];
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!u || !ch) return null;
    ch.members = ch.members.filter(m => m != id)
    u.channels = u.channels.filter(c => c != channel)

    editExistingItem(CHANNEL_PATH, channel, {
        members: ch.members,
        requests: ch.requests
    })

    editExistingItem(USER_PATH, id, {
        requests: u.requests,
        channels: u.channels
    })

    return { channel: ch, user: u }
}

function acccpetUser(channel, id) {
    let u = getExistingItem(USER_PATH, id);
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!u || !ch) return null;


    u.channels.push(channel)
    ch.members.push(id)


    u.requests = u.requests.filter((uid) => {
        return uid !== channel;
    });
    ch.requests = ch.requests.filter((chid) => {
        console.log(`comparing: ${chid} - ${id} === ${chid !== id}`)
        return chid !== id;
    })

    console.log(`ch -> ${ch.requests}`)

    editExistingItem(CHANNEL_PATH, channel, {
        members: ch.members,
        requests: ch.requests,
    })

    editExistingItem(USER_PATH, id, {
        requests: u.requests,
        channels: u.channels
    })
    return { status: "accepted", channel: ch, user: u }
}

function rejectUser(channel, id) {
    let u = getExistingItemsWhere(USER_PATH, { id })[0];
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!user || !ch) return null;
    u.requests = u.requests.filter((uid) => {
        return uid !== channel;
    });
    ch.requests = ch.requests.filter((chid) => {
        console.log(`comparing: ${chid} - ${id} === ${chid !== id}`)
        return chid !== id;
    })

    editExistingItem(CHANNEL_PATH, channel, {
        members: ch.members,
        requests: ch.requests
    })

    editExistingItem(USER_PATH, id, {
        requests: u.requests,
        channels: u.channels
    })
    return "User has been rejected!"
}

function deleteChannelFromDb(channel, id) {
    const ch = getExistingItem(CHANNEL_PATH, channel)

    if (!ch) return null;
    if (ch.coordinator === id) {
        deleteExistingItem(CHANNEL_PATH, channel)
        return { channel: ch }
    }
    else {
        return "You have no perms to do this!"
    }
}

function newMessage(channel, author, body) {
    let ch = getExistingItem(CHANNEL_PATH, channel);

    console.log(ch);
    ch.messages.push({ author, body })

    editExistingItem(CHANNEL_PATH, channel, {
        messages: ch.messages
    })

    return { channel, author, body }
}

function getAllChannels() {
    return getAllCollection(CHANNEL_PATH);
}

module.exports = {
    signupUser,
    login,
    getUserInformation,
    getChannelInformation,
    addChannelToDb,
    deleteChannelFromDb,
    newRequestToJoin,
    expelUser,
    acccpetUser,
    rejectUser,
    newMessage,
    getAllChannels
}