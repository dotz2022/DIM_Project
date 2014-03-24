import os

def populate():
    
    company = add_company(name='Company1',
                          logo='logo.jpg',
                          website='www.company.com')
    
    pm = add_user(username='projectmanager', password='password', email='pm@gmail.com', first_name='Project', last_name='Manager', company=company)
    
    m = add_user(username='member1', password='member1', email='member1@gmail.com', first_name='Justin', last_name='Chan')
    
    m2 = add_user(username='member2', password='member2', email='member2@gmail.com', first_name='Kayden', last_name='Lee')
    
    add_UserProfile(user=pm, picture='profile_images/face1.jpg', role='Project Manager', company=company)
    add_UserProfile(user=m, picture='profile_images/face2.jpg', role='member', company=company)
    add_UserProfile(user=m2, picture='profile_images/face3.jpg', role='member', company=company)
    
    print pm
    print m
    print m2
    # Print out what we have added to the user.
    for u in User.objects.all():
        print u;

def add_user(username, password, email, first_name, last_name):
    m = User.objects.get_or_create(username=username, password=password, email=email, first_name=first_name, last_name=last_name)    
    return m

def add_company(name, logo, website):
    c = Company.objects.get_or_create(name=name, logo=logo, website=website)
    return c

def add_UserProfile(user, picture, role, company):
    up = UserProfile.objects.get_or_create(user=user, picture=picture, role=role, company=company)
    return up

# Start execution here!
if __name__ == '__main__':
    print "Starting SEIRC population script..."
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DIM_Project.settings')
    from SEIRC.models import Company, User, UserProfile, Chat
    populate()