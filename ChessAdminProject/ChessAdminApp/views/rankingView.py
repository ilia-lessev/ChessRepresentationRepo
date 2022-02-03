from django.shortcuts import render
from django.http import HttpResponse
from datetime import datetime
import urllib.parse

import ssl
ssl._create_default_https_context = ssl._create_unverified_context

def viewRankingHistory(request):
    return render(request,'rankingHistory.html')
def viewRankingHistoryExpl(request):
    return render(request,'rankingHistoryExpl.html')
def viewRankingLinesExpl(request):
    return render(request,'rankingLinesExpl.html')
    

def getRankingHistory(request):
     now = datetime.now()
     timestamp = datetime.timestamp(now)
     url ='https://chessadmin.cloudtyme.com/getRankingHistory'        #'http://127.0.0.1:8000/getRankingHistory'        #'https://chessadmin.cloudtyme.com/getRankingHistory'
     source = urllib.request.urlopen(url).read()  
     response = HttpResponse(source, content_type='text/csv')
     response['Content-Disposition'] = f'attachment; filename={timestamp}'    
     response["Cache-Control"] = "no-cache, no-store, must-revalidate" # HTTP 1.1.
     response["Pragma"] = "no-cache" # HTTP 1.0.
     response["Expires"] = "0" # Proxies.
     return response  #HttpResponse(source, content_type="text/csv")
     

    
     
