var Game = require('../models/game');

exports.create_game = function(req, res) {
    let game = new Game(
        {
            board: req.body.board,
            feedbackPegs: req.body.feedbackPegs,
            secretCode: req.body.secretCode,
            numRows: req.body.numRows,
            numColumns: req.body.numColumns,
            currentRowIndex: req.body.currentRowIndex,
            isGameActive: req.body.isGameActive
        }
    );
    game.save(function(err) {
        if (err) {
            console.error(err);
            res.end();
        }
    });
    res.end();
}
