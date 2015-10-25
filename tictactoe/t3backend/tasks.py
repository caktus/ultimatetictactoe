from t3 import board, mcts

import requests
import json
import sys


def ai_play(pk, state):
    b = board.Board()
    ai = mcts.MonteCarlo(board=b)
    ai.update(state)

    play = b.pack(ai.get_play())
    url = 'http://localhost:8000/api/games/{pk}/'.format(pk=pk)
    r = requests.put(url, data={'play': play, 'extra': json.dumps(ai.stats)})

    r.raise_for_status()


if __name__ == '__main__':
    pk = int(sys.argv[1])
    state = json.loads(sys.argv[2])

    ai_play(pk, state)
