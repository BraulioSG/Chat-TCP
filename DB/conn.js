const mongoose = require('mongoose')

const usi = 'mongodb+srv://diego:Feliz2002+@cluster0.xz7orcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const dbconnect = () => {
  mongoose.connect(usi, {}, (err, _res) => {
    if (!err) {
      console.log('Connexión correcta')
    }
    else {
      console.log('Error en la conexión')
    }
  })
}

module.exports = dbconnect