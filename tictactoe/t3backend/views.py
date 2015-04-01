from rest_framework import generics, viewsets, mixins
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
        game = serializer.save(state=json.dumps(b.start()),
                               p1=p1, p2=p2)

        if p1 == 'ai':
            tasks.ai_play(game.pk, b.start())


class GameDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.PlaySerializer

    def perform_update(self, serializer):
        b = board.Board()
        play = b.parse(serializer.validated_data['play'])
        new_state = b.play(json.loads(serializer.instance.state), play)
        game = serializer.save(state=json.dumps(new_state),
                               last_play=json.dumps(play))

        players = {1: game.p1, 2: game.p2}
        if players[new_state[-1]] == 'ai' and serializer.get_winner(game) == 0:
            tasks.ai_play(game.pk, new_state)
