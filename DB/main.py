import os
from models import Chanel, User, Message, Authentication, Response
from pathlib import Path  
from uuid import uuid4
ruta_db = Path(Path.cwd() / "DB")

Diego = User(uuid4(), "Diego", [], ["22c202cf-999f-4d5c-b45a-f341c80bc36a"], [])
John = User(uuid4(), "John", [], [], ["22c202cf-999f-4d5c-b45a-f341c80bc36a"])

ISGCumbiakings = Chanel(uuid4(),"ISGCumbiakings", [Diego, John], ["Hi John", "Hi Doe!"])

# -----------------------Cosas que ya funcionan------------------------
# ---------Chanels---------
# ISGCumbiakings.create_ch()
# ISGCumbiakings.delete_ch()
# ---------Users-----------
# Diego.get_channels()
# John.get_requests()
# Diego.create_user() <- Hace falta verificar si es que ya existe el usuario


# -----------------------Probando todavia------------------------------
info = Diego.get_info()
print("Info -> ",info)
newInfo = info.split("&")
print(newInfo)
c = newInfo[3].split('=')
print(c[1])
listChannels = list(c[1])
print(listChannels)