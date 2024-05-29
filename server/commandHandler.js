const db = require("./database");

function handleCommmand(command) {
  separated_data = command.split(":")
  service = separated_data[0].split("/")
  let res = {
    error: "",
    data: ""
  }
  switch (service[0]) {
    case "auth":
      switch (service[1]) {
        case "lgin":
          let info = separated_data[1].split("&")
          let user = info[0].split("=")
          let pass = info[1].split("=")
          let user_id = db.login(user[1], pass[1])
          if (user_id != null) {
            return res = {
              error: "null",
              data: user_id
            }
          }
          return res = {
            error: "User not found",
            data: "null"
          }
        case "sgup":
          info = separated_data[1].split("&")
          user = info[0].split("=")
          pass = info[1].split("=")
          user_id = db.login(user[1], pass[1])
          if (user_id != null) {
            return res = {
              error: "null",
              data: user_id
            }
          }
          return res = {
            error: "User not found",
            data: "null"
          }
      }
    case "usrs":
      switch (service[1]) {
        case "info":
          let token = separated_data[1].split('=')
          let data = db.getUserInformation(token[1], "info")
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "User does not exists",
              data: "null"
            }
          }
        case "chns":
          token = separated_data[1].split('=')
          data = db.getUserInformation(token[1], "chns")
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "User does not exists",
              data: "null"
            }
          }
        case "reqs":
          token = separated_data[1].split('=')
          data = db.getUserInformation(token[1], "reqs")
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "User does not exists",
              data: "null"
            }
          }
      }
    case "msgs":
      switch (service[1]) {
        case "send":
          let info = separated_data[1].split("&")
          let ch_name = info[0].split("=")
          let token = info[1].split("=")
          let body = info[2].split('=')
          let data = db.newMessage(ch_name[1], token[1], body[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Message was not send!",
              data: "null"
            }
          }
      }
    case "chns":
      switch (service[1]) {
        case "crte":
          let info = separated_data[1].split("&")
          let ch_name = info[0].split("=")
          let token = info[1].split("=")
          let data = db.addChannelToDb(ch_name[1], token[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          }
          return res = {
            error: "Channel already Exists",
            data: "null"
          }
        case "join":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split("=")
          data = db.newRequestToJoin(ch_name[1], token[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel or user does not exist",
              data: "null"
            }
          }
        case "expl":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          data = db.expelUser(ch_name[1], token[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel or user does not exist",
              data: "null"
            }
          }
        case "dele":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          data = db.deleteChannelFromDb(ch_name[1], token[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel does not exist",
              data: "null"
            }
          }
        case "accp":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          data = db.acccpetUser(ch_name[1], token[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel or user does not exist",
              data: "null"
            }
          }
        case "rejc":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          data = db.rejectUser(ch_name[1], token[1])
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel or user does not exist",
              data: "null"
            }
          }
        case "msgs":
          ch_name = separated_data[1].split('=')
          data = db.getChannelInformation(ch_name[1], "msgs")
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel does not exists",
              data: "null"
            }
          }
        case "reqs":
          ch_name = separated_data[1].split('=')
          data = db.getChannelInformation(ch_name[1], "reqs")
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel does not exists",
              data: "null"
            }
          }
        case "mems":
          ch_name = separated_data[1].split('=')
          data = db.getChannelInformation(ch_name[1], "mems")
          if (data != null) {
            return res = {
              error: "null",
              data: data
            }
          } else {
            return res = {
              error: "Channel does not exists",
              data: "null"
            }
          }
      }
  }
}

// handleCommmand("msgs/send:channel=isgc&token=001&body=Hola, como estan?")

module.exports = handleCommmand;