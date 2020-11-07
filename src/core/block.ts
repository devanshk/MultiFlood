export class Block {
  owning_player: number;
  color: number;
  color_index: number;

  constructor(
    color: number,
    color_index: number,
  ) {
    this.owning_player = -1;
    this.color = color;
    this.color_index = color_index;
  }

  claim(
    claiming_player: number,
    claiming_color: number,
    claiming_color_index: number
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
