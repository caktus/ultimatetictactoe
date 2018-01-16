from t3 import board
from mcts import uct

import requests
import json
import sys


def ai_action(pk, state):
    b = board.Board()
    ai = uct.UCTWins(board=b, time=5)
    ai.update(state)

    action = ai.get_action()
    url = 'http://localhost:8000/api/games/{pk}/'.format(pk=pk)
    r = requests.put(url, data={'action': action, 'extra': json.dumps(ai.data)})

    r.raise_for_status()


if __name__ == '__main__':
    pk = int(sys.argv[1])
    state = json.loads(sys.stdin.read())

    ai_action(pk, state)
