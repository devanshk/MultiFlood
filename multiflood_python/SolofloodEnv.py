from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import abc
import tensorflow as tf
import numpy as np
from collections import namedtuple

from tf_agents.environments import py_environment
from tf_agents.environments import tf_environment
from tf_agents.environments import tf_py_environment
from tf_agents.environments import utils
from tf_agents.specs import array_spec
from tf_agents.environments import wrappers
from tf_agents.environments import suite_gym
from tf_agents.trajectories import time_step as ts

tf.compat.v1.enable_v2_behavior()

SolofloodState = namedtuple(
    "SoloFloodState",
    [
        "num_colors",
        "height",
        "width",
        "owned_blocks",
        "current_color",
        "num_turns"
    ]
)

class SolofloodEnv(py_environment.PyEnvironment):
  
  def __init__(self, num_colors, width, height):
    self._action_spec = array_spec.BoundedArraySpec(
        shape=(), dtype=np.int32, minimum=0, maximum=3, name='action')
    # Single integer representing reward
    self._observation_spec = array_spec.BoundedArraySpec(
        shape=(1,), dtype=np.int32, minimum=0, name='observation')
    self._state = SolofloodState(
        4,
        10,
        10,
        0,
        0,
        0
    )
    self._episode_ended = False

  def action_spec(self):
    return self._action_spec

  def observation_spec(self):
    return self._observation_spec

  def _reset(self):
    self._state = SolofloodState(
        4,
        10,
        10,
        0,
        0,
        0
    )
    self._episode_ended = False
    return ts.restart(np.array([self._state], dtype=np.int32))

  def _step(self, action):
    '''Step function, can be called with env._step()'''
    # TODO: complete implementation of flood logic

    if self._episode_ended:
      # The last action ended the episode. Ignore the current action and start
      # a new episode.
      return self.reset()

    # Make sure episodes don't go on forever.
    self._state.current_color = action
    self._state.owned_blocks += np.random.randint(1, self._state.width * self._state.height - self._state.owned_blocks - 1)
    self._state.num_turns += 1


    if self._episode_ended or self._state.owned_blocks >= self._state.height*self._state.width:
      reward = -1*self._state.num_turns
      return ts.termination(np.array([self._state], dtype=np.int32), reward)
    else:
      return ts.transition(
          np.array([self._state], dtype=np.int32), reward=0.0, discount=1