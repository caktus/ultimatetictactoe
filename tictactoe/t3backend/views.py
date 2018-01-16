import json
import subprocess
import sys

from django.db.models import Q
from rest_framework import generics, viewsets, mixins

from . import models, serializers
from t3 import board

PY = sys.executable or 'python'


class GameListAPIView(generics.ListCreateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.GameSerializer

    def perform_create(self, serializer):
        b = board.Board()
        gametype = serializer.validated_data.pop('gametype')
        if gametype == 'local':
            p1 = p2 = 'local'
        elif gametype == 'ai':
            p1, p2 = 'local', 'ai'
        elif gametype == 'ai-vs-ai':
            p1 = p2 = 'ai'

        state = b.unpack_state(b.starting_state())
        jsonstate = json.dumps(state)
        game = serializer.save(state=jsonstate, p1=p1, p2=p2)

        if p1 == 'ai':
            proc = subprocess.Popen([PY, "tictactoe/t3backend/tasks.py", str(game.pk)],
                                    stdin=subprocess.PIPE)
            proc.stdin.write(jsonstate)
            proc.stdin.close()


class GameDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.GameDetailSerializer

    def perform_update(self, serializer):
        state = json.loads(serializer.instance.state)
        action = serializer.validated_data['action']

        if action == 'q':
            # On forfeit, the winner shall be the previous_player from the state.
            game = serializer.save(
                last_action='q',
                winner=json.dumps({state['player']: 0, state['previous_player']: 1})
            )
            return

        game = serializer.instance
        players = {1: game.p1, 2: game.p2}
        if action == 'timeout':
            # The AI temporarily takes over when a player takes too long.
            players[state['player']] = 'ai'
            jsonstate = game.state
        else:
            b = board.Board()

            state = b.unpack_state(b.next_state(b.pack_state(state), b.pack_action(action)))
            jsonstate = json.dumps(state)

            # Create a record for the submitted action.
            game.actions.create(player=state['previous_player'], action=action,
                                extra=serializer.validated_data['extra'])
            # TODO: Change the action submission endpoint to a view that
            # directly uses ActionSerializer.

            win_values = b.win_values([b.pack_state(state)])
            game = serializer.save(
                state=jsonstate, last_action=action,
                winner=json.dumps(win_values) if win_values else ''
            )

        if players[state['player']] == 'ai' and not game.winner:
            proc = subprocess.Popen([PY, "tictactoe/t3backend/tasks.py", str(game.pk)],
                                    stdin=subprocess.PIPE)
            proc.stdin.write(jsonstate)
            proc.stdin.close()
