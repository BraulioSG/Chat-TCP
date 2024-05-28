const input = document.getElementById("message-input");
const sendBtn = document.getElementById("SendButton");
const chat = document.getElementById("chat");
const channelList = document.getElementById("channel-list");
const channelTitle = document.getElementById("channel-title");
const channelMembers = document.getElementById("channel-members")


const requests = document.getElementsByClassName("chat-requests")[0];



const username = "BraulioSG"

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

function appendNewRequest(user, userId) {
    const req = document.createElement("div");
    req.classList.add("chat-req");

    const p = document.createElement("p");
    p.innerHTML = `<strong class="chat-req-user">${user}</strong> wants to join the channel`

    const approveBtn = document.createElement("button");
    approveBtn.classList.add("approve", "approve-req")
    approveBtn.innerHTML = `<i class="material-icons">check</i>`;

    const denyBtn = document.createElement("button");
    denyBtn.classList.add("destroy", "denty-req")
    denyBtn.innerHTML = `<i class="material-icons">block</i>`;

    approveBtn.onclick = () => {
        //send command to aprove the request

        req.remove();
    }

    denyBtn.onclick = () => {
        //send command to deny the request

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

    if (username === author) {
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
        const lastMsg = msgs[msg.length - 1];
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

        if (members.indexOf(username) === -1) {
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

function createChannelDiv(channelID, msgs) {
    const channel = document.createElement("div");
    channel.classList.add("channel");
    channel.id = channelID;

    chat.appendChild(channel)
}

function newChannel(channelID, channelName, msgs = [], members = []) {
    createChannelDiv(channelID);
    createChannelBtn(channelID, channelName, msgs, members)
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

function sendMessage() {
    const body = input.value.replace(/\"/g, "").trim();

    if (body.trim().length <= 0) {
        return;
    }

    newMessage(activeChat, "BraulioSG", body);
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    input.value = "";
}

input.onkeydown = (evt) => {
    if (evt.keyCode === 13) { //enter
        sendMessage();
    }
}

sendBtn.onclick = () => {
    sendMessage()
}


newChannel("0001", "First Group", [], ["BraulioSG", "DiegoJMZ", "EduardoMV"])
newChannel("0002", "Second Group", [], ["DiegoJMZ", "EduardoMV"])
newChannel("0003", "Third Group", [], ["BraulioSG", "DiegoJMZ"])

setTimeout(() => {
    newMessage("0001", "DiegoJmz", "hello");
}, 2000);
newMessage("0001", "DiegoJmz", "hello");

