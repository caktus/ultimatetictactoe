from django.db import models
from django.utils import timezone


class T3Game(models.Model):
    state = models.TextField()
    winner = models.IntegerField(default=0)
    last_play = models.TextField()
    p1 = models.CharField(max_length=16)
    p2 = models.CharField(max_length=16)


class T3Move(models.Model):
    game = models.ForeignKey(T3Game, related_name='moves')
    player = models.IntegerField()
    play = models.TextField()
    extra = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
