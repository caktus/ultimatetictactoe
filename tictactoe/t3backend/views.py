from rest_framework import generics, viewsets, mixins
import json

from . import models, serializers
from t3 import board


class GameListAPIView(generics.ListCreateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.GameSerializer

    def perform_create(self, serializer):
        b = board.Board()
        serializer.save(state=json.dumps(b.start()))


class GameDetailAPIView(generics.RetrieveAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.GameSerializer


class GamePlayAPIView(generics.UpdateAPIView):
    queryset = models.T3Game.objects.all()
    serializer_class = serializers.PlaySerializer

    def perform_update(self, serializer):
        b = board.Board()
        new_state = b.play(json.loads(serializer.instance.state),
                           b.parse(serializer.validated_data['play']))
        serializer.save(state=json.dumps(new_state))
