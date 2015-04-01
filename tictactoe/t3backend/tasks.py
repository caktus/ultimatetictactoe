from t3 import board, mcts

import requests


def ai_play(pk, state):
    b = board.Board()
    ai = mcts.MonteCarlo(board=b)
    ai.update(state)

    play = b.pack(ai.get_play())
    url = 'http://localhost:8000/api/games/{pk}/'.format(pk=pk)
    r = requests.put(url, data={'play': play})

    r.raise_for_status()
