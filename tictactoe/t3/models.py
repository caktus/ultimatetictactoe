from django.db import models


class T3User(models.Model):
    username = models.CharField(max_length=64, unique=True)
    score = models.IntegerField(default=0)


class T3Game(models.Model):
    state = models.TextField()


class T3Player(models.Model):
    game = models.ForeignKey(T3Game)
    user = models.ForeignKey(T3User)

    player = models.CharField(max_length=1) # X or O
    score = models.IntegerField(default=0)
