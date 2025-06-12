const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'El evento es obligatorio']
  }
});



module.exports = mongoose.model('Favorite', favoriteSchema);