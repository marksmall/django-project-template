from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
# from django.contrib.auth.mixins import LoginRequiredMixin

# class InitView(LoginRequiredMixin, TemplateView):
#     login_url = 'accounts/login/'
#     template_name = 'index.html'

# @login_required


@method_decorator(login_required, name='dispatch')
class InitView(TemplateView):
    template_name = 'index.html'
