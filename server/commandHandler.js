const db = require("./database");

const services = {
  auth: {
    lgin: (query) => {
      let res = {}

      const [userToken, passToken] = query.split("&");
      const [_userKey, user] = userToken.split("=");
      const [_passKey, pass] = passToken.split("=");

      const user_id = db.login(user, pass)
      console.log(":)")

      if (!user_id) {
        res.error = "Incorrect auth";
        res.data = "null"
      }
      else if (user_id.length === 0) {
        res.error = "User not found";
        res.data = "null";
      }
      else {
        res.error = "null";
        res.data = { "userId": user_id };
      }

      return res;
    },
    sgup: (query) => {
      let res = {}

      const [userToken, passToken] = query.split("&");
      const [_userKey, user] = userToken.split("=");
      const [_passKey, pass] = passToken.split("=");

      const user_id = db.signupUser(user, pass)

      if (user_id != null) {
        res.error = "null";
        res.data = { "userId": user_id };
      }
      else {
        res.error = "Cannot create user";
        res.data = "null";

      }

      return res;
    }
  },

  usrs: {
    info: (query) => {
      let res = {}

      const [_tokenKey, token] = query.split("=")
      const data = db.getUserInformation(token, "info")

      if (data != null) {
        res.error = "null";
        res.data = { data }

      } else {
        res.error = "User does not exists";
        res.data = "null"
      }

      return res;

    },
    chns: (query) => {
      let res = {}

      const [_tokenKey, token] = query.split("=")
      const data = db.getUserInformation(token, "chns")
      if (data != null) {
        res.error = "null";
        res.data = { data }

      } else {
        res.error = "User does not exists";
        res.data = "null"
      }

      return res;
    },
    reqs: (query) => {
      let res = {}

      const [_tokenKey, token] = query.split("=")
      const data = db.getUserInformation(token, "reqs")
      if (data != null) {
        res.error = "null";
        res.data = { data }

      } else {
        res.error = "User does not exists";
        res.data = "null"
      }

      return res;
    },
  },

  msgs: {
    send: (query) => {
      let info = query.split("&")
      let ch_name = info[0].split("=")
      let token = info[1].split("=")
      let body = info[2].split('=')

      const { username } = db.getUserInformation(token[1], "info")

      let data = db.newMessage(ch_name[1], username, body[1])

      const mems = db.getChannelInformation(ch_name[1], "mems")

      if (mems !== null) {
        return {
          type: "BROADCAST",
          to: mems,
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Message was not send!",
          data: "null"
        }
      }
    },
  },

  chns: {
    crte: (query) => {
      const info = query.split("&")
      const ch_name = info[0].split("=")
      const token = info[1].split("=")

      console.log(query);
      console.log(token);
      const data = db.addChannelToDb(ch_name[1], token[1])
      db.acccpetUser(data, token[1])
      if (data != null) {
        return res = {
          type: "BROADCAST",
          error: "null",
          data: { data }
        }
      }
      return res = {
        error: "Channel already Exists",
        data: "null"
      }
    },
    join: (query) => {
      const info = query.split("&")
      const ch_name = info[0].split("=")
      const token = info[1].split("=")
      const data = db.newRequestToJoin(ch_name[1], token[1])

      const ch = db.getChannelInformation(ch_name[1], "info")

      if (data != null) {
        return {
          type: "BROADCAST",
          to: [ch.coordinator],
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Channel or user does not exist",
          data: "null"
        }
      }
    },
    expl: (query) => {
      const info = query.split("&")
      const ch_name = info[0].split("=")
      const token = info[1].split('=')
      const data = db.expelUser(ch_name[1], token[1])
      if (data != null) {
        return res = {
          error: "null",
          data: { data }
        }
      } else {
        return res = {
          error: "Channel or user does not exist",
          data: "null"
        }
      }

    },
    dele: (query) => {
      const info = query.split("&")
      const ch_name = info[0].split("=")
      const token = info[1].split('=')
      const data = db.deleteChannelFromDb(ch_name[1], token[1])

      if (data != null) {
        return {
          error: "null",
          data: { data }
        }
      } else {
        return res = {
          error: "Channel does not exist",
          data: "null"
        }
      }
    },
    accp: (query) => {
      const info = query.split("&")
      const ch_name = info[0].split("=")
      const token = info[1].split('=')
      const data = db.acccpetUser(ch_name[1], token[1])

      const mems = db.getChannelInformation(ch_name[1], "mems")

      if (data != null) {
        return {
          type: "BROADCAST",
          to: [...mems],
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Channel or user does not exist",
          data: "null"
        }
      }
    },
    rejc: (query) => {
      const info = query.split("&")
      const ch_name = info[0].split("=")
      const token = info[1].split('=')
      const data = db.rejectUser(ch_name[1], token[1])
      if (data != null) {
        return {
          type: "BROADCAST",
          to: [token[1]],
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Channel or user does not exist",
          data: "null"
        }
      }
    },
    msgs: (query) => {
      const ch_name = query.split('=')
      const data = db.getChannelInformation(ch_name[1], "msgs")

      if (data != null) {
        return {
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Channel does not exists",
          data: "null"
        }
      }
    },
    reqs: (query) => {
      const ch_name = query.split('=')
      const data = db.getChannelInformation(ch_name[1], "reqs")
      if (data != null) {
        return {
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Channel does not exists",
          data: "null"
        }
      }
    },
    mems: (query) => {
      const ch_name = query.split('=')
      const data = db.getChannelInformation(ch_name[1], "mems")
      if (data != null) {
        return res = {
          error: "null",
          data: { data }
        }
      } else {
        return res = {
          error: "Channel does not exists",
          data: "null"
        }
      }
    },
    info: (query) => {
      const ch_name = query.split('=')
      const data = db.getChannelInformation(ch_name[1], "info")
      if (data != null) {
        return {
          error: "null",
          data: { data }
        }
      } else {
        return {
          error: "Channel does not exists",
          data: "null"
        }
      }
    },
    list: (_query) => {
      const data = db.getAllChannels()
      return {
        error: "null",
        data: { data }
      }
    }
  }
}

function handleCommmand(command) {
  const [req, data] = command.split(":");
  const [service, cmd] = req.split("/");

  let res = {
    error: "",
    type: "RESPONSE",
    to: [],
    desc: req,
    data: ""
  }

  try {
    const info = services[service][cmd](data);
    res = { ...res, ...info };
  }
  catch (e) {
    console.log(e);
    res.data = "null";
    res.error = "Command not found"
  }
  return res;
}

// handleCommmand("msgs/send:channel=isgc&token=001&body=Hola, como estan?")

module.exports = handleCommmand;