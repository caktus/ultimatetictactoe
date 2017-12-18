import json

from rest_framework import serializers, validators
from t3.board import Board

from . import models


class GameSerializer(serializers.ModelSerializer):
    gametype = serializers.ChoiceField(
        choices=['local', 'ai', 'ai-vs-ai'],
        write_only=True
    )

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'last_action', 'winner', 'gametype', 'p1', 'p2')
        read_only_fields = ('pk', 'state', 'last_action', 'winner', 'p1', 'p2')


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.T3Action
        fields = ('player', 'action', 'extra', 'timestamp')


class GameDetailSerializer(GameSerializer):
    action = serializers.CharField(write_only=True)
    extra = serializers.CharField(allow_blank=True, default='', write_only=True)

    actions = ActionSerializer(many=True, read_only=True)

    class Meta:
        model = models.T3Game
        fields = ('pk', 'state', 'last_action', 'winner', 'p1', 'p2', 'action',
                  'extra', 'actions')
        read_only_fields = ('pk', 'state', 'last_action', 'winner', 'p1', 'p2',
                            'actions')

    def validate_action(self, value):
        if self.instance.winner:
            raise serializers.ValidationError("Game is over.")

        if value == 'q':
            return value  # Player forfeits
        if value == 'timeout':
            return value  # AI takes over

        b = Board()
        action = b.pack_action(value)
        state = b.pack_state(json.loads(self.instance.state))
        if action is None or not b.is_legal([state], action):
            raise serializers.ValidationError("Illegal action.")
        return value
