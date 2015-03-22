from django.conf.urls import patterns, url

from .views import MoveAPIView


urlpatterns = patterns('',
    url(r'^move/$', MoveAPIView.as_view(), name='api_move'),
)