from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


@method_decorator(login_required, name="dispatch")
class IndexView(TemplateView):

    # this 'index.html' comes from CLIENT_DIR
    template_name = "index.html"

index_view = IndexView.as_view()
