const Board = require("./board");
const Dice = require("./dice");
const prompt = require('prompt-sync')();
const Player = require("./player");
const Snake = require("./snake");
const Logger = require("js-logger");

class Game {
    constructor(startPosition, endPosition, numberOfSteps, snakes, dice) {
        this.board = new Board(startPosition, endPosition);
        this.numberOfSteps = numberOfSteps;
        this.dice = dice;
        this.player = undefined;
        this.snakes = snakes.map((snake => new Snake(snake.head, snake.tail)));
    }

    handleSnakebite(position) {
        let filteredSnakes = this.snakes.filter(snake => snake.hasBitten(position));
        // ignoring the case where multiple snake's head on a same position as it's not valid
        return filteredSnakes.length === 0 ? position : filteredSnakes[0].tail
    }

    start(name) {
        this.player = new Player(name, this.board.getStartPosition());
        for (let turn = 0; turn < this.numberOfSteps; turn++) {
            const value = this.dice.roll();
            const nextPosition = this.player.getNextPosition(value);
            if (this.board.isValid(nextPosition)) {
                this.player.updatePosition(this.handleSnakebite(nextPosition));
                Logger.info(`Your turn number: ${turn} and dice value is ${value}`);
            } else {
                Logger.info(`Skipping... position is not valid ${nextPosition}`);
            }
        }
        return this.player.getCurrentPosition();
    }
}

module.exports = Game
