import json

from django.core.cache import cache
from django.http import HttpResponse
from django.views.generic import View


class EchoAPIView(View):
    def get(self, request, *args, **kwargs):
        """Method use to retrive other player's moves."""
        move = cache.get('move')
        player = cache.get('player')
        current_player = request.GET.get('player')
        if not (player == current_player) and move:
            data = {'type': 'move'}
            data.update(move)
            cache.set('move', {}, 86400)  # one day
        else:
            data = {'type': 'msg', 'message': 'Waiting on the other player.'}
        return HttpResponse(json.dumps(data), content_type='application/json')

    def post(self, request, *args, **kwargs):
        """Method use to make moves. Only current player can make a move."""
        data = request.POST
        player = cache.get('player')
        move_type = data.get('type', 'move')
        if move_type == 'move':
            current_player = request.GET.get('player')
            if not player == current_player:
                # only current player can make a move
                move = {
                    'boardIndex': data.get('boardIndex'),
                    'rowIndex': data.get('rowIndex'),
                    'columnIndex': data.get('columnIndex')
                }
                # update cache
                cache.set('player', current_player, 86400)  # one day
                cache.set('move', move, 86400)
                data = {'msg': 'Move has been made.'}
            else:
                data = {'msg': "Please wait for other player's move."}
        elif move_type == 'forfeit':
            cache.delete('player')
            cache.delete('move')
            data = {'msg': 'You have forfeited the game.'}
        return HttpResponse(json.dumps(data), content_type='application/json')
