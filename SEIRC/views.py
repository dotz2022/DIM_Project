from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response, redirect
from SEIRC.forms import CompanyForm, UserForm, UserProfileForm
from django.contrib.auth import authenticate, login, logout
from SEIRC.models import UserProfile, Chat
from django.db.models import Max
import json

def push_message(request):
    print request.GET['chatid']
    print Chat.objects.filter(chatid=request.GET['chatid']).count()
    #return HttpResponse(json.dumps(resp), mimetype="application/json")
    
def message(request):
    print request.GET['chatid']
    print request.GET['usernames']
    print request.GET['message']
    chat_create = Chat(chatid=request.GET['chatid'], sender=request.user.username, receivers=request.GET['usernames'], message=request.GET['message'])
    chat_create.save();
    
    msg = Chat.objects.latest("timestamp")
    timestamp = str(msg.timestamp).split('.');
    resp = {'message': msg.message, 'timestamp': timestamp[0], 'sender': request.user.username}
    
    return HttpResponse(json.dumps(resp), mimetype="application/json")

def add_username(request):
    
    print request.GET['chatid']
    print request.GET['usernames']
    chat_create = Chat(chatid=request.GET['chatid'], sender=request.user.username, receivers=request.GET['usernames'])
    chat_create.save();
    
    return HttpResponse(chat_create.receivers)


def create_chat(request):
    
    max_chatid = Chat.objects.aggregate(Max('chatid'))['chatid__max'] 
    
    if max_chatid is None:
        max_chatid = 0  
        
    chat_create = Chat(chatid=max_chatid+1, sender=request.user, receivers=request.GET['usernames'])
    chat_create.save();
    
    resp = {'receivers': chat_create.receivers, 'chatid': chat_create.chatid}
    
    return HttpResponse(json.dumps(resp), mimetype="application/json")
    
def index(request):
    return render_to_response('seirc/index.html', RequestContext(request))

def home(request):
    
    if request.user.is_authenticated():
        profile = UserProfile.objects.get(user=request.user)
        company_members = UserProfile.objects.filter(company=profile.company).exclude(user=request.user)
        return render_to_response('seirc/home.html', {'user': request.user, 'profile': profile, 'company_members':company_members}, RequestContext(request))
    else:
        return redirect('/')

def add_member(request):
    
    context = RequestContext(request)
    
    added = False
    if request.user.is_authenticated():
        
        profile = UserProfile.objects.get(user=request.user)
        company_members = UserProfile.objects.filter(company=profile.company).exclude(user=request.user)
        
        if request.method == 'POST':
            #validate forms
            member_form = UserForm(request.POST)
            member_profile_form = UserProfileForm(request.POST)
        
            if member_form.is_valid() and member_profile_form.is_valid():    
                #add the member profile
                member = member_form.save()
                member.set_password(member.password)
                member.save()
                
                member_profile = member_profile_form.save(commit=False)
                member_profile.user = member
                #same company but different roles
                member_profile.company = profile.company 
                member_profile.role = 'member'
                if 'picture' in request.FILES:
                    member_profile.picture = request.FILES['picture']
                member_profile.save()
                added = True
                return render_to_response('seirc/add_member.html', {'added': added, 'profile': profile, }, context)
            else:
                # The supplied form contained errors - just print them to the terminal.
                print member_form.errors, member_profile_form.errors
            
        else:
            member_form = UserForm()
            member_profile_form = UserProfileForm()
            return render_to_response('seirc/add_member.html', {'member_form': member_form, 
                                                         'member_profile_form': member_profile_form, 
                                                         'profile': profile,
                                                         'company_members':company_members}, context)
    else:
        return redirect('/')   
      
def user_login(request):
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(username=username, password=password)
        
        if user:
            
            if user.is_active:
                login(request, user)
                return redirect('/home')
            else:
                error_msg = 'account disabled'
                return render_to_response('seirc/error.html', {'error': error_msg})
        else:
            error_msg = 'Invalid Credentials'
            return render_to_response('seirc/error.html', {'error': error_msg })            
        
    else:
        return redirect('/')
    
def user_logout(request): 
    logout(request)    
    return redirect('/')


def register(request):

    context = RequestContext(request)
    
    registered = False
    
    if request.method == 'POST':
        #validate forms
        company_form = CompanyForm(request.POST)
        user_form = UserForm(request.POST)
        user_profile_form = UserProfileForm(request.POST)
            
        if company_form.is_valid() and user_form.is_valid() and user_profile_form.is_valid():
    
            company = company_form.save(commit=False)
            if 'logo' in request.FILES:
                company.logo = request.FILES['logo']
            company.save()
            
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            
            profile = user_profile_form.save(commit=False)
            profile.user = user
            profile.company = company
            profile.role = 'Project Manager'
            
            if 'picture' in request.FILES:
                profile.picture = request.FILES['picture']
            profile.save()

            registered = True
            
            return render_to_response('seirc/register.html', {'registered': registered})
        
        else:
            # The supplied form contained errors - just print them to the terminal.
            print company_form.errors, user_form.errors    
        
        
    else:
        # If not POST means is a normal request and it will display individual forms
        company_form = CompanyForm()
        user_form = UserForm() 
        user_profile_form = UserProfileForm()
        
    return render_to_response('seirc/register.html', {'company_form': company_form, 
                                                      'user_form': user_form, 
                                                      'user_profile_form': user_profile_form}, context)    
    