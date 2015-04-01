from django.db import models


class T3Game(models.Model):
    state = models.TextField()
    last_play = models.TextField()
    p1 = models.CharField(max_length=16)
    p2 = models.CharField(max_length=16)
