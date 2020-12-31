from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import abc
import tensorflow as tf
import numpy as np

from tf_agents.environments import py_environment
from tf_agents.environments import tf_environment
from tf_agents.environments import tf_py_environment
from tf_agents.environments import utils
from tf_agents.specs import array_spec
from tf_agents.environments import wrappers
from tf_agents.environments import suite_gym
from tf_agents.trajectories import time_step as ts

tf.compat.v1.enable_v2_behavior()

def validate_env(env):
    ''' Convenience function to valdate environments '''
    utils.validate_py_environment(env, episodes=5)

def build_tf_env(env):
    '''Uses TF wrapper to build tf environment from python environemnts'''
    tf_env = tf_py_environment.TFPyEnvironment(env)

    print(isinstance(tf_env, tf_environment.TFEnvironment))
    print("TimeStep Specs:", tf_env.time_step_spec())
    print("Action Specs:", tf_env.action_spec())

    return tf_env
