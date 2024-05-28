from pathlib import Path
from uuid import uuid4
import os
ruta_db = Path(Path.cwd() / "DB")
ruta_ch = Path(Path.cwd() / "DB" / "Channels")

class Chanel:
  def __init__(self, id: int, name: str, users, messages ):
    
    user_array = []
    for u in users:
      user_string = "id="+str(u.id)+"&"+"name="+u.name
      user_array.append(user_string)
    self.ch_id = id
    self.ch_name = name
    self.ch_users= user_array 
    self.ch_messages= messages

  # Creates a Channel
  def create_ch(self):
    #Creas el chanal y sus subdirectorios en donde se guardara su informacion
    ruta_nuevo_ch = Path(ruta_ch / self.ch_name)
    if os.path.exists(ruta_nuevo_ch):
      print("El canal ya existe")
      return
    else:
      Path.mkdir(ruta_nuevo_ch)
      ruta_mensajes = Path(ruta_nuevo_ch / "messages")
      Path.mkdir(ruta_mensajes)
      ruta_usuarios = Path(ruta_nuevo_ch / "users")
      Path.mkdir(ruta_usuarios)

      #Creas los archivos con la informacion que te dan
      chat_info_f = ruta_nuevo_ch / "chat_info.txt"
      f = open(chat_info_f, 'a')
      f.write(str(self.ch_id) + '\n')
      f.close()

      chat_messages_f = ruta_mensajes / "messages.txt"
      f = open(chat_messages_f, 'a')
      for m in self.ch_messages:
        f.write(str(m) + '\n')
      f.close()

      chat_users_f = ruta_usuarios / "users.txt"
      f = open(chat_users_f, 'a')
      for u in self.ch_users:
        f.write(str(u) + '\n')
      f.close()

      print("Channels created correclty!")

  # Deletes a specific channel
  def delete_ch(self):
    ruta_a_borrar = Path(ruta_ch / self.ch_name)
    if os.path.exists(ruta_a_borrar):
      ruta_chat_info = Path(ruta_a_borrar / 'chat_info.txt')
      ruta_mensajes = Path(ruta_a_borrar / "messages")
      ruta_mensajes_a = Path(ruta_a_borrar / "messages" / 'messages.txt')
      ruta_usuarios = Path(ruta_a_borrar / "users")
      ruta_usuarios_a = Path(ruta_a_borrar / "users" / 'users.txt')
      os.unlink(ruta_mensajes_a)
      os.unlink(ruta_usuarios_a)
      os.rmdir(ruta_mensajes)
      os.rmdir(ruta_usuarios)
      os.unlink(ruta_chat_info)
      os.rmdir(ruta_a_borrar)
      print("Channel deleted correctly!")
      return
    else:
      print("Channel does not exist")
      return

  # Sends a request to join a channel
  def join_ch(self):
    pass

  # Kicks a user out of a channel
  def expel_user(self):
    pass

  # Accepts a user into a channel
  def accpet_user(self):
    pass

  # Denies a user from a channel
  def rej_user(self):
    pass

  # Returns a list of the messages send to the channel
  def messages(self):
    pass

  # Returns a list of the pending requests of a channel
  def pending_req(self):
    pass

  # Returns a list of the channel Members
  def members(self):
    pass

class User:
  def __init__(self, user_id: int, user_name: str, user_conn , user_channles , user_request):
    self.id = user_id
    self.name = user_name
    self.conn = user_conn
    self.channles = user_channles
    self.request = user_request
  
  def create_user(self):
    ruta_usuarios_a = Path(ruta_db / "users.txt")
    user_string = "id="+str(self.id)+"&"+"name="+self.name
    f = open(ruta_usuarios_a, 'a')
    f.write(user_string + "\n")
    f.close()
    print("User created correctly!")
    return
  
  # Returns all of the users information
  def get_info(self):
    user_string = "id="+str(self.id)+"&"+"name="+self.name+"&"+"conn="+str(self.conn)+"&"+"channels="+str(self.channles)+"&"+"request="+str(self.request)
    return user_string

  # Returns a list of the ch_id the user is in 
  def get_channels(self):
    return self.channles

  # Returns all of the pending requests the user has
  def get_requests(self):
    return self.request

class Message:
  def __init__(self, body, date, channel):
    self.body = body
    self.date = date
    self.channel = channel
  
  # Sends a message to a specific channel
  def send(self):
    pass

class Authentication:
  def __init__(self, user_name, user_password):
    self.user_name = user_name
    self.user_password = user_password

  # Authenticates that the users info exists
  def log_in(self):
    pass

  # Creates the new user and adds it on the database
  def sign_up(self):
    pass

class Response:
  # error:errmsg/data:data
  def __init__(self, data, err):
    self.data = data
    self.err = err

  # Returns an ok answer if everything was ok 
  def ok(self):
    pass
  
  # Returns what went wrong in the request
  def error(self):
    pass
