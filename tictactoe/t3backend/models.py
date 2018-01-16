from django.db import models
from django.utils import timezone


class T3Game(models.Model):
    state = models.TextField()
    winner = models.TextField()
    last_action = models.TextField()
    p1 = models.CharField(max_length=16)
    p2 = models.CharField(max_length=16)


class T3Action(models.Model):
    game = models.ForeignKey(T3Game, related_name='actions')
    player = models.IntegerField()
    action = models.TextField()
    extra = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
