from django.conf.urls import patterns, url

from . import views


urlpatterns = patterns('',
    url(r'^games/$', views.GameListAPIView.as_view(),
        name='game_list'),
    url(r'^games/(?P<pk>\d+)/$', views.GameDetailAPIView.as_view(),
        name='game_detail'),
    url(r'^games/(?P<pk>\d+)/play/$', views.GamePlayAPIView.as_view(),
        name='game_play'),
)
