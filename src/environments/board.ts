import "phaser";
import { Block } from "./square";


// Class to hold the definition of a Board
export class Board {
    dimension: integer;
    board: Array<Array<Block>>;
    num_colors: number;
    num_players: number;

    constructor(
        dimension: integer,
        num_colors: number,
        num_players: number,
    ) {
        this.dimension = dimension;
        this.num_colors = num_colors;
        this.board = []; // Initialize array
        for (var i = 0 ; i < this.dimension; i++) {
            this.board[i] = []; // Initialize inner array
            for (var j = 0; j < this.dimension; j++) { // i++ needs to be j++
                // Multiple blocks with the same color should not be adjacent
                let color_candidates = [];
                for (let index = 0; index < this.num_colors; index++){
                    if (
                        !(j > 0 && this.board[i][j-1].get_color() == index) &&
                        !(i > 0 && this.board[i-1][j].get_color() == index)
                    )
                    {
                        color_candidates.push(index)
                    }
                }
                let color_index = (Math.random() * color_candidates.length | 0);
                this.board[i][j] = new Block(
                    color_candidates[color_index]
                );
            }
        }
    }

    get_block(x: integer, y: integer): Block {
        return this.board[x][y];
    }

    claim_block(row: integer, col: integer, player: integer, color: number): boolean {
        return this.board[row][col].claim(player, color);
    }

    get_dimension(): integer {
        return this.dimension;
    }

    set_board(player: number, color: number): void {
        // Sets the blocks owned by a given player to the same color
        [].concat.apply([], this.board).forEach(
            (block: Block) => block.owning_player == player ? block.color = color : {}
        ); 
    }
}