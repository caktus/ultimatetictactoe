from rest_framework import serializers, validators
import json

from . import models
from t3.board import Board


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.T3Game
        fields = ('pk', 'state')
        read_only_fields = ('pk', 'state')


class PlaySerializer(serializers.ModelSerializer):
    play = serializers.CharField()

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'play')
        read_only_fields = ('pk', 'state')

    def validate_play(self, value):
        board = Board()
        play = board.parse(value)
        if play is None or not board.is_legal(json.loads(self.instance.state), play):
            raise serializers.ValidationError("Illegal play.")
        return value