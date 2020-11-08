import { sampleSize } from 'lodash';

export class Memory<T> {
  private samples: Array<T>;
  length: number;

  constructor(
    private maxMemory: number
  ) {
    this.samples = [];
  }

  push(sample: T) {
    this.samples.push(sample);
    this.length += 1;
    if (this.samples.length > this.maxMemory) {
      this.samples.shift();
      this.length -= 1;
    }
  }

  sample(batch_size: number) {
    return sampleSize(this.samples, batch_size);
  }

}
