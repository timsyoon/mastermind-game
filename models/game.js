var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema(
  {
    board: { type: [[String]], required: true },
    feedbackPegs: { type: [[String]], required: true },
    secretCode: { type: [String], required: true },
    numRows: { type: Number, required: true },
    numColumns: { type: Number, required: true },
    currentRowIndex: { type: Number, required: true },
    isGameActive: { type: Boolean, required: true }
  }
);

// Virtual for the game's URL
GameSchema.virtual('url').get(function () {
  return '/games/' + this._id;
});

// Export model
module.exports = mongoose.model('Game', GameSchema);
