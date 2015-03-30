from django.conf.urls import patterns, url

from .views import EchoAPIView


urlpatterns = patterns('',
    url(r'^echo/$', EchoAPIView.as_view(), name='api_move'),
)
