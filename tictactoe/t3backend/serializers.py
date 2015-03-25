from rest_framework import serializers, validators
import json

from . import models
from t3.board import Board


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.T3User
        fields = ('pk', 'username', 'score')
        read_only_fields = ('pk', 'score')


class PlayerSerializer(serializers.ModelSerializer):
    game = serializers.HyperlinkedRelatedField(view_name='game-detail',
                                               read_only=True)
    user = serializers.SlugRelatedField(slug_field='username',
                                        read_only=True)

    class Meta:
        model = models.T3Player
        fields = ('game', 'user', 'player', 'score')
        read_only_fields = ('game', 'score',)


class GameSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'players')
        read_only_fields = ('pk', 'state', 'players')


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
