export class Block{
  owning_player: integer;
  color: number;

  constructor(
      color: number,
  ) {
      this.owning_player = -1;
      this.color = color;
  }

  get_color(): number {
    return this.color;
  }

  claim(
      claiming_player: integer,
      claiming_color: number,
  ): boolean {
      if (this.owning_player > 0) {
          return false;
      }
      this.owning_player = claiming_player;
      this.color = claiming_color < 0? this.color : claiming_color;
      return true;
  }
}