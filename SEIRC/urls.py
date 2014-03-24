from django.conf.urls import patterns, url
from SEIRC import views

urlpatterns = patterns('',
                       url(r'^$', views.index, name = 'index'),
                       url(r'^register$', views.register, name='register'),
                       #url(r'^home$', views.home, name='home'),
                       url(r'^home$', views.home, name='home'),
                       #url(r'^restricted$', views.restricted, name='restricted'),
                       url(r'^login$', views.user_login, name='login'),
                       url(r'^logout$', views.user_logout, name='logout'),
                       url(r'^add_member$', views.add_member, name='add_member'),
                       url(r'^create_chat$', views.create_chat, name="create_chat"),
                       url(r'^add_username$', views.add_username, name="add_username"),
                       url(r'^message$', views.message, name="message"),
                       url(r'^poll_message$', views.poll_message, name="poll_message"),
                       url(r'^push_message$', views.push_message, name="push_message"),
                       url(r'^push_notify$', views.push_notify, name="push_notify"),
                       url(r'^poll_chat$', views.poll_chat, name="poll_chat"),
                       url(r'^poll_receivers$', views.poll_receivers, name="poll_receivers"),
                       )