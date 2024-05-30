const input = document.getElementById("message-input");
const sendBtn = document.getElementById("SendButton");
const chat = document.getElementById("chat");
const channelList = document.getElementById("channel-list");
const channelTitle = document.getElementById("channel-title");
const channelMembers = document.getElementById("channel-members")
const requests = document.getElementsByClassName("chat-requests")[0];

const user = JSON.parse(window.sessionStorage.getItem("user-info")).data;
let channels = {}
console.log(user);

let activeChat = ""

function switchChannel(channelID) {
    const channels = Array.from(chat.getElementsByClassName("channel"));
    const buttons = Array.from(channelList.getElementsByClassName("channel-btn"));

    activeChat = channelID;

    channels.forEach(channel => {
        if (channel.id === channelID) {
            channel.classList.add("active")

            setTimeout(() => {
                channel.getElementsByClassName("unread-msg")[0]?.remove();
            }, 2000);
        }
        else {
            channel.classList.remove("active");
        }
    });


    buttons.forEach(button => {
        if (button.id === `btn-${channelID}`) {
            button.classList.add("active")
        }
        else {
            button.classList.remove("active");
        }
    });

}

function appendNewRequest(channelID, user, userId) {
    const req = document.createElement("div");
    req.classList.add("chat-req");

    const p = document.createElement("p");
    p.innerHTML = `<strong class="chat-req-user">${user}</strong> wants to join ${channels[channelID].name}`

    const approveBtn = document.createElement("button");
    approveBtn.classList.add("approve", "approve-req")
    approveBtn.innerHTML = `<i class="material-icons">check</i>`;

    const denyBtn = document.createElement("button");
    denyBtn.classList.add("destroy", "denty-req")
    denyBtn.innerHTML = `<i class="material-icons">block</i>`;

    console.log(`req from : ${user} -> ${userId}`)

    approveBtn.onclick = () => {
        //send command to aprove the request
        window.connectionAPI.connect(`chns/accp:channel=${channelID}&token=${userId}`)
        req.remove();
    }

    denyBtn.onclick = () => {
        //send command to deny the request
        window.connectionAPI.connect(`chns/rejc:channel=${channelID}&token=${userId}`)

        req.remove();
    }

    req.appendChild(p);
    req.appendChild(approveBtn);
    req.appendChild(denyBtn);



    return requests.appendChild(req);
}

function createNewMessage(body) {

    const msg = document.createElement("div");
    msg.classList.add("msg");

    msg.innerText = body;

    return msg;

}

function createNewChunk(author) {
    const chunk = document.createElement("div");
    chunk.classList.add("msg-chunk");

    if (user.username === author) {
        console.log(":)")
        chunk.classList.add("me-chunk");
    }

    const span = document.createElement("span");
    span.classList.add("msg-author");

    const strong = document.createElement("strong");
    strong.innerText = author;

    span.appendChild(strong);
    chunk.appendChild(span);


    return chunk;
}

function createChannelBtn(channelID, channelName, msgs = [], members = []) {
    const button = document.createElement("button");
    button.classList.add("channel-btn");
    button.id = `btn-${channelID}`;

    const h5 = document.createElement("h5");
    h5.classList.add("channel-name");
    h5.innerText = channelName;

    const p = document.createElement("p");
    p.classList.add("channel-lastmsg");

    p.innerText = "New channel";

    if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        p.innerText = lastMsg.body;
    }

    const span = document.createElement("span");
    span.classList.add("notification-badge");
    span.innerHTML = "<small>0</small>"

    button.appendChild(h5);
    button.appendChild(p);
    button.appendChild(span);

    button.onclick = () => {
        switchChannel(channelID);
        button.classList.remove("unread");
        span.innerText = "0";

        channelMembers.innerHTML = `<small>${members.join(", ")}</small>`;
        channelTitle.innerText = channelName;

        if (members.indexOf(user.id) === -1) {
            input.disabled = true;
            sendBtn.disabled = true;
            input.placeholder = "No perteneces a este canal";
        } else {
            input.disabled = false;
            sendBtn.disabled = false;
            input.placeholder = "Escribe tu mensaje";
        }
    }

    channelList.appendChild(button);
}

function createChannelDiv(channelID, locked = false) {
    const channel = document.createElement("div");
    channel.classList.add("channel");
    channel.id = channelID;

    if (locked) {
        channel.classList.add("locked");
    }

    const overlay = document.createElement("div");
    overlay.classList.add("channel-overlay")
    const container = document.createElement("div");
    container.classList.add("channel-overlay-container");

    const title = document.createElement("h3");
    title.innerText = "Oh no!"

    const message = document.createElement("p");
    message.innerText = "Envía una solicituda para que el administrador te acepte";

    const sendReq = document.createElement("Button");
    sendReq.classList.add("primary");
    sendReq.innerText = "Eviar solicitud";

    sendReq.disabled = user.requests.indexOf(channelID) !== -1;

    sendReq.onclick = () => {
        sendReq.disabled = true;
        window.connectionAPI.connect(`chns/join:channel=${channelID}&token=${user.id}`)
    }

    container.append(title);
    container.append(message);
    container.append(sendReq);
    overlay.append(container);
    channel.append(overlay);
    chat.appendChild(channel)

    return channel;
}

function newChannel(channel, locked) {
    const section = createChannelDiv(channel.id, locked);
    const button = createChannelBtn(channel.id, channel.name, channel.messages, channel.members)

    return {
        section, button
    }
}

function newMessage(channelID, author, body) {
    const channel = document.getElementById(channelID);
    const chunks = channel.getElementsByClassName("msg-chunk");

    if (channelID !== activeChat) {
        const button = document.getElementById(`btn-${channelID}`);

        const badge = button.getElementsByClassName("notification-badge")[0];
        const val = parseInt(badge.innerText) + 1
        badge.innerText = val.toString();

        button.classList.add("unread");

        let unreadMsg = channel.getElementsByClassName("unread-msg")[0];
        if (!unreadMsg) {
            unreadMsg = document.createElement("span");
            unreadMsg.classList.add("system-msg")
            unreadMsg.classList.add("unread-msg")
            channel.appendChild(unreadMsg);
        }
        unreadMsg.innerText = `${val} unread messages`;


    }
    let currentChunk = null;

    if (chunks.length <= 0) {
        currentChunk = createNewChunk(author);
        channel.appendChild(currentChunk);

    }

    else {
        currentChunk = chunks[chunks.length - 1];
        chunkAuthor = currentChunk.getElementsByClassName("msg-author")[0].innerText;

        if (chunkAuthor !== author) {
            currentChunk = createNewChunk(author);
            channel.appendChild(currentChunk);
        }
    }



    const msg = createNewMessage(body);
    currentChunk.appendChild(msg);


}

function newSystemMessage(channelID, text) {
    const channel = document.getElementById(channelID);

    const span = document.createElement("span");
    span.classList.add("system-msg");
    span.innerText = text;

    channel.append(span);
}

function sendMessage() {
    const body = input.value.replace(/\"/g, "").trim();

    if (body.trim().length <= 0) {
        return;
    }


    window.connectionAPI.connect(`msgs/send:channel=${activeChat}&token=${user.id}&body=${body}`)
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    input.value = "";
}

function sendNewChannel() {
    const newChannelInput = document.querySelector("input#newChannelInput");

    const cmd = `chns/crte:name=${newChannelInput.value}&token=${user.id}`;
    window.connectionAPI.connect(cmd)

    toggleNewChannelMenu();
}

function toggleNewChannelMenu() {
    const newChannelInput = document.querySelector("input#newChannelInput");
    newChannelInput.value = "";

    const popup = document.querySelector("div.newChannelPopup");
    popup.classList.toggle("show");
}

input.onkeydown = (evt) => {
    if (evt.keyCode === 13) { //enter
        sendMessage();
    }
}

sendBtn.onclick = () => {
    sendMessage()
}

window.onload = () => {
    window.connectionAPI.connect("chns/list:null")
}

window.connectionAPI.onResponse((res) => {
    if (res.error !== "null") {

    } else {
        const { data } = res.data;
        if (res.desc === "chns/list") {
            data.forEach(ch => {
                const locked = ch.members.indexOf(user.id) === -1
                channels[ch.id] = { ...ch, ...newChannel(ch, locked) }
                ch.messages.forEach(msg => {
                    console.log(msg);
                    newMessage(ch.id, msg.author, msg.body);
                })


                if (ch.coordinator === user.id) {
                    console.log(`Im coordinator of ${ch.name}`)
                    window.connectionAPI.connect(`chns/reqs:channel=${ch.id}`);
                }
            })

            console.log(channels);
        }
        if (res.desc === "chns/crte") {
            window.connectionAPI.connect(`chns/info:channel=${data}`)
        }
        if (res.desc === "chns/info") {
            const locked = data.members.indexOf(user.id) === -1
            channels[data.id] = { ...data, ...newChannel(data, locked) }
        }
        if (res.desc === "msgs/send") {
            newMessage(data.channel, data.author, data.body)
        }

        if (res.desc === "chns/join") {
            appendNewRequest(data.channel, data.user.username, data.user.id)
        }

        if (res.desc === "chns/reqs") {
            data.forEach(req => {
                appendNewRequest(req.channel.id, req.user.username, req.user.id);
            })
        }

        if (res.desc === "chns/rejc") {
            console.log("rejected");
        }

        if (res.desc === "chns/accp") {
            channels[data.channel.id].section.classList.remove("locked");
            channels[data.channel.id].members.push(user.id);

            console.log(data);
            if (activeChat === data.channel) {
                input.disabled = false;
                input.placeholder = "Escribe tu mensaje"
            }

            newSystemMessage(data.channel.id, `${data.user.username} entro al canal`)

        }

    }
});