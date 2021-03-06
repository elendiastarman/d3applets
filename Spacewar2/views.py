from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from django.template import Context, RequestContext
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.views.decorators.csrf import csrf_exempt

import os
import json
import sys
import urllib
import traceback
import subprocess

# Create your views here.
def main_view(request, *args, **kwargs):

    context = RequestContext(request)

    if sys.platform == 'win32':
        path = os.path.join(os.getcwd(),"Spacewar2","static","Spacewar2")
    elif sys.platform == 'linux':
        path = os.path.join("/home","elendia","webapps","play","play","Spacewar2","static","Spacewar2","")

    paths = [(path,""), (os.path.join(path,"bots"),"bots/")]

    scripts = []
    for path, plus in paths:
        for filename in os.listdir(path):
            if filename.endswith('.js'): scripts.append('Spacewar2/'+plus+filename)
    context['scripts'] = scripts

    return render(request, 'Spacewar2/main.html', context_instance=context)

# @csrf_exempt
# def github_view(request, *args, **kwargs):

    # data = json.loads(request.body.decode())

    # if 'pusher' in data and sys.platform == 'linux':
        # if data['pusher']['name'] in ('elendiastarman','ConorOBrien-Foxx'):
            # try:
                # os.chdir("/home/elendia/webapps/maingit/repos/Spacewar2-js.git/")
                # attempt = subprocess.call("./pull-from-github")
# ##                with open('github_pull_attempt.txt','w') as f: f.write("Exit code: %s"%attempt)
            # except Exception as e:
                # with open('Spacewar2-github-pull-error.txt','w') as f: f.write("Error: %s"%e) 

    # return HttpResponse("OK")

# def intersectionTest_view(request, *args, **kwargs):

    # context = RequestContext(request)

# ##    if sys.platform == 'win32':
# ##        path = os.path.join(os.getcwd(),"Spacewar2","static","Spacewar2")
# ##    elif sys.platform == 'linux':
# ##        path = os.path.join("/home","elendia","webapps","play","play","Spacewar2","static","Spacewar2","")
# ##
# ##    print(path)
# ##    print(os.listdir(path))
# ##
# ##    scripts = []
# ##    for filename in os.listdir(path):
# ##        if filename.endswith('.js'): scripts.append('Spacewar2/'+filename)
# ##    context['scripts'] = scripts

    # return render(request, 'Spacewar2/intersectionTest.html', context_instance=context)
