from django.db import models


class T3Game(models.Model):
    state = models.TextField()
    last_play = models.TextField()
