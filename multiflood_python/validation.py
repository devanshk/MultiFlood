from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from utils import (
    validate_env
)
from SolofloodEnv import SolofloodEnv
from CardGameEnv import CardGameEnv

def validate_cardgame():
    env = CardGameEnv()
    validate_env(env)
    print("Validated CardGameEnv!")

def validate_soloflood():
    env = SolofloodEnv()
    validate_env(env)
    print("Validated SolofloodEnv!")

def validate():
    validate_cardgame()
    validate_soloflood()


validate()