from django import forms
from SEIRC.models import Company, User, UserProfile, Chat
    
class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        
class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    username = forms.CharField(help_text = '')
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('picture',)
        
class ChatForm:
    receviers = forms.CharField()
    message = forms.CharField()
    class Meta:
        model = Chat
        fields = ('message', 'receviers') 