from django.conf.urls import patterns, url
from django.views.decorators.csrf import ensure_csrf_cookie

from . import views


urlpatterns = patterns('',
    url(r'^games/$', views.GameListAPIView.as_view(),
        name='game_list'),
    url(r'^games/(?P<pk>\d+)/$',
        ensure_csrf_cookie(views.GameDetailAPIView.as_view()),
        name='game_detail'),
)
