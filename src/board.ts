import "phaser";

// Class to hold the definition of a Board
export class Board {
    dimension: integer;
    num_colors: integer;
    board: Array<Array<integer>>;

    constructor(dimension: integer, num_colors: integer) {
        this.dimension = dimension;
        this.num_colors = num_colors;
        this.board = []; // Initialize array
        for (var i = 0 ; i < this.dimension; i++) {
            this.board[i] = []; // Initialize inner array
            for (var j = 0; j < this.dimension; j++) { // i++ needs to be j++
                this.board[i][j] = (Math.random() * num_colors | 0);
            }
        }
    }
}

// TODO: Class to handle rendering the game board
export class BoardScene extends Phaser.Scene {
    board: Board;
    grid: Phaser.GameObjects.Grid;

    constructor(board: Board) {
        super({
            key: "BoardScene"
        });
        this.board = board;
    }

    init(params): void {
    }

    preload(): void {
        // TODO
    }
      
    create(): void {
        this.add.grid(
            undefined, 
            undefined, 
            undefined, 
            undefined, 
            128.0 / this.board.dimension, 
            128.0/this.board.dimension, 
            0xff0000, 
            undefined, 
            undefined, 
            undefined
        );
        this.scene.start("BoardScene");
    }

    update(time): void {
        // TODO
    }
}