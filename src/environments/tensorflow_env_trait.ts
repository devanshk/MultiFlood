import * as tf from '@tensorflow/tfjs';

// TODO: this is unused, figure out what to do with it
export interface TensorflowEnvTrait<T extends tf.Tensor> {
  getStateTensor: () => T;
}
