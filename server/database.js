const { getExistingItem, getExistingItemsWhere, deleteExistingItem, addNewItemTo, editExistingItem } = require("./filemanager");

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
    const user = getExistingItemsWhere(USER_PATH, { username, password })[0];

    if (!user) return null;

    return user.id;
}

function getUserInformation(token, type) {
    let user = getExistingItemsWhere(USER_PATH, { token })[0];

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
        case "msgs":
            return ch.messages;
        case "reqs":
            return ch.request;
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

function newRequestToJoin(channel, token) {
    let user = getExistingItemsWhere(USER_PATH, { token })[0];
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!user || !ch) return null;
    user.requests.push({ channel })
    ch.requests.push({ token })
    editExistingItem(USER_PATH, token, {
        requests: user.requests
    })
    editExistingItem(CHANNEL_PATH, channel, {
        requests: ch.requests
    })
    return "Request Send!"
}

function expelUser(channel, token) {
    let u = getExistingItemsWhere(USER_PATH, { token })[0];
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!user || !ch) return null;
    ch.members = ch.members.filter(m => { m != token })
    u.channels = u.channels.filter(c => { c != channel })
    return "User expeled!"
}

function acccpetUser(channel, token) {
    let u = getExistingItemsWhere(USER_PATH, { token })[0];
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!user || !ch) return null;
    u.channels.push(channel)
    u.requests = u.requests.filter(r => { r != channel })
    ch.members.push(token)
    ch.requests = ch.requests.filter(r => { r != token })

    editExistingItem(CHANNEL_PATH, channel, {
        members: ch.members,
        request: ch.request
    })

    editExistingItem(USER_PATH, token, {
        requests: u.requests,
        channels: u.channels
    })
    return "User has been acepted!"
}

function rejectUser(channel, token) {
    let u = getExistingItemsWhere(USER_PATH, { token })[0];
    let ch = getExistingItem(CHANNEL_PATH, channel);

    if (!user || !ch) return null;
    u.requests = u.requests.filter(r => { r != channel })
    ch.requests = ch.requests.filter(r => { r != token })

    editExistingItem(CHANNEL_PATH, channel, {
        members: ch.members,
        request: ch.request
    })

    editExistingItem(USER_PATH, token, {
        requests: u.requests,
        channels: u.channels
    })
    return "User has been rejected!"
}

function deleteChannelFromDb(channel, token) {
    const ch = getExistingItem(CHANNEL_PATH, channel)

    if (!ch) return null;
    if (ch.coordinator === token) {
        deleteExistingItem(CHANNEL_PATH, channel)
        return "Channel deleted correctly!"
    }
    else {
        return "You have no perms to do this!"
    }
}

function newMessage(channel, author, body) {
    let ch = getExistingItem(CHANNEL_PATH, channel);
    ch.messages.push({ author, body })

    editExistingItem(CHANNEL_PATH, channel, {
        messages: ch.messages
    })
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
    newMessage
}