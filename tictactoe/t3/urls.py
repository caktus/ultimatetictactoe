from django.conf.urls import patterns, url

from . import views


urlpatterns = patterns('',
    url(r'^users/$', views.UserListAPIView.as_view(),
        name='user_list'),
    url(r'^users/(?P<pk>\d+)/$', views.UserDetailAPIView.as_view(),
        name='user_detail'),
    url(r'^games/$', views.GameListAPIView.as_view(),
        name='game_list'),
    url(r'^games/(?P<pk>\d+)/$', views.GameDetailAPIView.as_view(),
        name='game_detail'),
    url(r'^games/(?P<pk>\d+)/play/$', views.GamePlayAPIView.as_view(),
        name='game_play'),
)
