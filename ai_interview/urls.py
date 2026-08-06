from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from accounts.views import dashboard_view, home_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home_view, name="home"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("accounts/", include("accounts.urls")),
    path("resumes/", include("resumes.urls")),
    path("interviews/", include("interviews.urls")),
    path("api/", include("api.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
