const input = document.getElementById("message-input");
const sendBtn = document.getElementById("SendButton");
const chat = document.getElementById("chat");
const channelList = document.getElementById("channel-list");
const channelTitle = document.getElementById("channel-title");
const channelMembers = document.getElementById("channel-members")
const requests = document.getElementsByClassName("chat-requests")[0];

const user = JSON.parse(window.sessionStorage.getItem("user-info")).data;
let channels = {}

let activeChat = ""

function switchChannel(channelID) {
    const channels = Array.from(chat.getElementsByClassName("channel"));
    const buttons = Array.from(channelList.getElementsByClassName("channel-btn"));

    activeChat = channelID;
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;


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
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;


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
        chunk.classList.add("me-chunk");
    }
    if (author === "@Pimientos Chat") {
        chunk.classList.add("help-chunk");
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
    return button
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


    sendReq.onclick = () => {
        sendReq.disabled = true;
        setTimeout(() => {
            sendReq.disabled = false;
        }, 1000)
        if (user.requests.indexOf(channelID) === -1)
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

    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
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


    tokens = body.split(" ");
    if (tokens.length >= 1) {
        const [command, value] = tokens;
        if (command.startsWith("/")) {
            if (command === "/help") {
                newMessage(activeChat, "@Pimientos Chat", `/help -> muestra la lista de comandos del chat.\n/mems -> muestra la lista de miembros del canal.\n/admin -> muestra el coordinador del grupo.\n/exit -> salir del canal${channels[activeChat].coordinator === user.id ? "\n/remove <usuario> -> expulsa a un usuario del grupo.\n/delete -> delete the channel only if you are the only member left" : ""}`)
                input.value = "";
                return;
            }
            if (command === "/admin") {
                newMessage(activeChat, "@Pimientos Chat", `El coordinador del chat es:\n${channels[activeChat].coordinator} ${channels[activeChat].coordinator === user.id ? "(tú)" : ""}`)
                input.value = "";
                return;
            }
            if (command === "/mems") {
                newMessage(activeChat, "@Pimientos Chat", `Lista de miembros del canal:\n${channels[activeChat].members.map(m => m === user.id ? m + " (tú)" : m).join("\n")}`)
                input.value = "";
                return;
            }
            if (channels[activeChat].coordinator === user.id) {
                if (command === "/remove") {
                    if (!value) {
                        newMessage(activeChat, "@Pimientos Chat", "Falta el usuario");
                    }
                    else if (value === user.id) {
                        newMessage(activeChat, "@Pimientos Chat", "No te puedes eliminar a ti mismo");
                    }
                    else if (channels[activeChat].members.indexOf(value) === -1) {
                        newMessage(activeChat, "@Pimientos Chat", "Ese usuario no es miembro del canal");
                    }
                    else {
                        window.connectionAPI.connect(`chns/expl:channel=${activeChat}&token=${value}`)
                    }

                    input.value = "";
                    return;
                }
                if (command === "/delete") {
                    if (channels[activeChat].members.length > 1) {
                        newMessage(activeChat, "@Pimientos Chat", "Debes elimiar a los usuarios antes de borrar el canal");
                        newMessage(activeChat, "@Pimientos Chat", `Miembros por eliminar:\n${channels[activeChat].members.map(m => m === user.id ? "\r" : m).join("\n")}`)
                    }
                    else {
                        window.connectionAPI.connect(`chns/dele:channel=${activeChat}&token=${user.id}`)
                    }
                    input.value = "";
                    return;
                }
            }
            if (command === "/exit") {
                if (channels[activeChat].coordinator === user.id) {
                    newMessage(activeChat, "@Pimientos Chat", "No puedes salir del canal, eres el coordinador");
                }
                else if (channels[activeChat].members.indexOf(user.id) === -1) {
                    newMessage(activeChat, "@Pimientos Chat", "No eres miembro de este canal");
                }
                else {
                    window.connectionAPI.connect(`chns/expl:channel=${activeChat}&token=${user.id}`)
                }

                input.value = "";
            }
        }
    }


    window.connectionAPI.connect(`msgs/send:channel=${activeChat}&token=${user.id}&body=${body}`)
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
                    newMessage(ch.id, msg.author, msg.body);
                })


                if (ch.coordinator === user.id) {
                    window.connectionAPI.connect(`chns/reqs:channel=${ch.id}`);
                }
            })

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
        }

        if (res.desc === "chns/accp") {
            console.log(data);
            channels[data.channel.id].section.classList.remove("locked");
            channels[data.channel.id].members.push(data.user.id);

            if (activeChat === data.channel.id) {
                input.disabled = false;
                input.placeholder = "Escribe tu mensaje"

                channelMembers.innerHTML = `<small>${data.channel.members.join(", ")}</small>`;

            }


            newSystemMessage(data.channel.id, `${data.user.username} entró al canal`)
        }
        if (res.desc === "chns/expl") {
            console.log("exit");
            channels[data.channel.id] = { ...channels[data.channel.id], ...data.channel }
            if (activeChat === data.channel.id) {
                channelMembers.innerHTML = `<small>${data.channel.members.join(", ")}</small>`;
            }

            newSystemMessage(data.channel.id, `${data.user.username} abandonó el grupo`)
            if (user.id === data.user.id) {
                channels[data.channel.id].section.classList.add("locked");
                input.disabled = true;
                input.placeholder = "No perteneces a este canal";
            }


        }
        if (res.desc === "chns/dele") {
            const chid = data.channel.id;
            channels[chid].button.remove();
            channels[chid].section.remove();

            channelTitle.innerText = "Pimientos Chat";
            channelMembers.innerHTML = ""
            sendBtn.disabled = true;
            input.placeholder = "Selecciona un canal para comenzar";
        }

    }
});