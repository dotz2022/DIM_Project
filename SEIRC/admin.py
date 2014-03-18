from django.contrib import admin
from django.contrib.auth.models import User
from SEIRC.models import Company, UserProfile, Chat

# Define an inline admin descriptor for UserProfile model
# which acts a bit like a singleton
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Extended Fields'
    
class UserAdmin(admin.ModelAdmin):
    
    # To allow User to be able to add UserProfile Records
    inlines = (UserProfileInline, )
    
    # To control the fields to display
    #fields = (('first_name', 'last_name'), 'username')
    
    # To display ManyToMany fields in the User Model
    def get_groups(self, User):
        return "\n".join([g.groups for g in User.groups.all()])
    def get_permissions(self, User):
        return "\n".join([a.permissions for a in User.user_permissions.all()])
    
    # To add fields in display_list for the extended User
    def picture(self, request):
        if UserProfile.objects.filter(user__id = request.id):
            return UserProfile.objects.get(user__id = request.id).picture
        
    picture.short_description = 'picture'
    
    def role(self, request):
        if UserProfile.objects.filter(user__id = request.id):
            return UserProfile.objects.get(user__id = request.id).role
        
    role.short_description = 'role'
        
    list_display = ('username', 
                    'first_name', 
                    'last_name', 
                    'picture', 
                    'email',    
                    'is_active',
                    'last_login',
                    'date_joined',
                    'role')
    
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'logo', 'website')
    
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'chatid', 'sender', 'receivers', 'message', 'timestamp')    
    
# Register models
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Chat, ChatAdmin)