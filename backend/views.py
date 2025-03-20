from django.http import HttpResponse

def home_view(request):
    return HttpResponse("<h1>Welcome to Podcast Experts API</h1>") 