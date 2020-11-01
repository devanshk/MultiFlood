import "phaser";

export class Block{
    owning_player: integer;
    color: number;
    color_index: integer;

    constructor(
        color: number,
        color_index: integer,
    ) {
        this.owning_player = -1;
        this.color = color;
        this.color_index = color_index;
    }

    claim(
        claiming_player: integer, 
        claiming_color: number, 
        claiming_color_index: integer
    ): boolean {
        if (this.owning_player > 0) {
            return false;
        }
        this.owning_player = claiming_player;
        this.color = claiming_color;
        this.color_index = claiming_color_index;
        return true;
    }
}

// Class to hold the definition of a Board
export class Board {
    dimension: integer;
    board: Array<Array<Block>>;
    colors: Array<number>;

    constructor(
        dimension: integer, 
        colors: Array<number>,
    ) {
        this.dimension = dimension;
        this.colors = colors;
        let num_colors = this.colors.length;
        this.board = []; // Initialize array
        for (var i = 0 ; i < this.dimension; i++) {
            this.board[i] = []; // Initialize inner array
            for (var j = 0; j < this.dimension; j++) { // i++ needs to be j++
                let color_index = (Math.random() * num_colors | 0);
                this.board[i][j] = new Block(
                    this.colors[color_index],
                    color_index,
                );
            }
        }
    }

    get_block(x: integer, y: integer): Block {
        return this.board[x][y];
    }

    get_dimension(): integer {
        return this.dimension;
    }
}

// TODO: Class to handle rendering the game board
export class BoardScene extends Phaser.Scene {
    grid: Phaser.GameObjects.Grid;
    board: Board;

    constructor() {
        super({
            key: "BoardScene"
        });
        let colors = [
            0x0066ff,
            0x66ff66,
            0xff0000,
            0xffff00,

        ];
        this.board = new Board(5, colors);
    }

    init(params): void {
    }

    preload(): void {
        // TODO
    }
      
    create(): void {
        let position_x = 300;
        let position_y = 200;
        let block_objects = []
        for (let i = 0 ; i < this.board.get_dimension(); i++) {
            block_objects[i] = []
            for (let j = 0 ; j < this.board.get_dimension(); j++) {
                let block = this.board.get_block(i, j);
                block_objects[i][j] = this.add.rectangle(
                    position_x + i*50, 
                    position_y + j*50,
                    40,
                    40,
                    block.color
                );

            } 
        } 
    }

    update(time): void {
        // TODO
    }
}