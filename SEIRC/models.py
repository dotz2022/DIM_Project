from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    name = models.CharField(max_length = 128)
    logo = models.ImageField(upload_to='company_logo', blank=True)
    website = models.URLField()
    def __unicode__(self):
        return self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    picture = models.ImageField(upload_to='profile_images', blank=True)
    role = models.CharField(max_length=128)
    company = models.ForeignKey(Company)
    def __unicode__(self):
        return self.user.username
    
class Chat(models.Model):
    chatid = models.IntegerField(blank=False)
    sender = models.CharField(max_length="128")
    receivers =  models.CharField(max_length="1000")
    message = models.CharField(max_length="1000", blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __unicode__(self):
        return self.sender