var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema(
  {
    board: { type: [[String]], required: true },
    feedbackPegs: { type: [[String]], required: true },
    num_rows: { type: Number, required: true },
    num_columns: { type: Number, required: true },
    guessesRemaining: { type: Number, required: true },
    isGameActive: { type: Boolean, required: true }
  }
);

// Virtual for the game's URL
GameSchema.virtual('url').get(function () {
  return '/games/' + this._id;
});

// Export model
module.exports = mongoose.model('Game', GameSchema);
