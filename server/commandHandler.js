const db = require("./database");

function handleCommmand(command) {
  separated_data = command.split(":")
  service = separated_data[0].split("/")
  switch (service[0]) {
    case "auth":
      switch (service[1]) {
        case "lgin":
          info = separated_data[1].split("&")
          user = info[0].split("=")
          pass = info[1].split("=")
          user_id = db.login(user[1], pass[1])
          return // devolver la respuesta del Login
        case "sgup":
          info = separated_data[1].split("&")
          user = info[0].split("=")
          pass = info[1].split("=")
          user_id = db.login(user[1], pass[1])
          return // devolver la respuesta del Login
      }
    case "usrs":
      switch (service[1]) {
        case "info":
          token = separated_data[1].split('=')
          return db.getUserInformation(token[1], "info")
        case "chns":
          token = separated_data[1].split('=')
          return db.getUserInformation(token[1], "chns")
        case "reqs":
          token = separated_data[1].split('=')
          return db.getUserInformation(token[1], "reqs")
      }
    case "msgs":
      switch (service[1]) {
        case "send":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split("=")
          body = info[2].split('=')
          db.newMessage(ch_name[1], token[1], body[1])
          return // Nose que se regresa aqui
      }
    case "chns":
      switch (service[1]) {
        case "crte":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split("=")
          ch_id = db.addChannelToDb(ch_name[1], token[1])
          return // devolver el id del canal
        case "join":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split("=")
          db.newRequestToJoin(ch_name[1], token[1])
          return // devolver confirmacion de peticion
        case "expl":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          db.expelUser(ch_name[1], token[1])
          return // devolver confirmacion de expulsion
        case "dele":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          db.deleteChannelFromDb(ch_name[1], token[1])
          return // devolver confirmacion de eliminacion
        case "accp":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          db.acccpetUser(ch_name[1], token[1])
          return // devolver confirmacion de aceptacion
        case "rejc":
          info = separated_data[1].split("&")
          ch_name = info[0].split("=")
          token = info[1].split('=')
          db.rejectUser(ch_name[1], token[1])
          return //Confirmacion de rechazo
        case "msgs":
          ch_name = separated_data[1].split('=')
          return db.getChannelInformation(ch_name[1], "msgs")
        case "reqs":
          ch_name = separated_data[1].split('=')
          return db.getChannelInformation(ch_name[1], "reqs")
        case "mems":
          ch_name = separated_data[1].split('=')
          return db.getChannelInformation(ch_name[1], "mems")
      }
  }
}

// handleCommmand("msgs/send:channel=isgc&token=001&body=Hola, como estan?")

module.exports = handleCommmand;