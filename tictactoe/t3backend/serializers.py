from rest_framework import serializers, validators
import json

from . import models
from t3.board import Board


class GameSerializer(serializers.ModelSerializer):
    winner = serializers.SerializerMethodField()

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'last_play', 'winner')
        read_only_fields = ('pk', 'state', 'last_play', 'winner')

    def get_winner(self, obj):
        board = Board()
        return board.winner([json.loads(obj.state)])


class PlaySerializer(GameSerializer):
    play = serializers.CharField()

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'last_play', 'winner', 'play')
        read_only_fields = ('pk', 'state', 'last_play', 'winner')

    def validate_play(self, value):
        board = Board()
        play = board.parse(value)
        if play is None or not board.is_legal(json.loads(self.instance.state), play):
            raise serializers.ValidationError("Illegal play.")
        return value
