from django.urls import path
from . import views
from .views.rankingView import getRankingHistory
from .views.rankingView import viewRankingHistory
from .views.index import index

urlpatterns = [
    path('', index),
    path('viewRankingHistory/', views.rankingView.viewRankingHistory, name='viewRankingHistory'),
    path('viewRankingHistoryExpl/', views.rankingView.viewRankingHistoryExpl, name='viewRankingHistoryExpl'),
    path('viewRankingLinesExpl/', views.rankingView.viewRankingLinesExpl, name='viewRankingLinesExpl'),
    path('getRankingHistory/', views.rankingView.getRankingHistory, name='getRankingHistory'),
    
    
]
                    