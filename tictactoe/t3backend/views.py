from rest_framework import generics, viewsets, mixins
from django.db.models import Q
import subprocess
import random
import json

from . import models, serializers, tasks
from t3 import board


class GameListAPIView(generics.ListCreateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.GameSerializer

    def perform_create(self, serializer):
        b = board.Board()
        gametype = serializer.validated_data.pop('gametype')
        if gametype == 'local':
            p1 = p2 = 'local'
        elif gametype == 'remote':
            players = ['astro', 'caktus']
            random.shuffle(players)
            p1, p2 = players
        elif gametype == 'ai':
            players = ['local', 'ai']
            random.shuffle(players)
            p1, p2 = players
        elif gametype == 'ai-vs-ai':
            p1 = p2 = 'ai'

        state = json.dumps(b.start())
        game = serializer.save(state=state, p1=p1, p2=p2)

        if p1 == 'ai':
            subprocess.Popen(["python", "tictactoe/t3backend/tasks.py",
                             str(game.pk), state])


class ChallengeAPIView(generics.ListAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.GameSerializer

    def get_queryset(self):
        return self.queryset.filter(Q(p1='astro') | Q(p1='caktus'), winner=0)


class GameDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.PlaySerializer

    def perform_update(self, serializer):
        state = json.loads(serializer.instance.state)

        if serializer.validated_data['play'] == 'q':
            # On forfeit, set the winner to -1 if player 1 quit, or -2
            # if player 2 quit.
            game = serializer.save(last_play='q', winner=-state[-1])
            return

        game = serializer.instance
        players = {1: game.p1, 2: game.p2}
        if serializer.validated_data['play'] == 'timeout':
            # The AI temporarily takes over when a player takes too long.
            players[state[-1]] = 'ai'
            jsonstate = game.state
        else:
            b = board.Board()
            play = b.parse(serializer.validated_data['play'])

            state = b.play(state, play)
            jsonstate = json.dumps(state)

            game = serializer.save(
                state=jsonstate, last_play=json.dumps(play),
                winner=b.winner([state])
            )

        if players[state[-1]] == 'ai' and game.winner == 0:
            subprocess.Popen(["python", "tictactoe/t3backend/tasks.py",
                             str(game.pk), jsonstate])
