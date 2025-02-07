from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def home(request):
    # message = {'message': "Hello, world!"}
    return render(request, 'index.html')

def load_html(request, filename):
    return render(request, filename)