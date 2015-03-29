from rest_framework import serializers, validators
import json

from . import models
from t3.board import Board


class GameSerializer(serializers.ModelSerializer):
    winner = serializers.SerializerMethodField()
    gametype = serializers.ChoiceField(
        choices=['local', 'remote', 'ai', 'ai-vs-ai'],
        write_only=True
    )

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'last_play', 'winner', 'gametype', 'p1', 'p2')
        read_only_fields = ('pk', 'state', 'last_play', 'winner', 'p1', 'p2')

    def get_winner(self, obj):
        board = Board()
        return board.winner([json.loads(obj.state)])


class PlaySerializer(GameSerializer):
    play = serializers.CharField(write_only=True)

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
