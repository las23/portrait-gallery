import datetime

def get_context_processors():
    """Return context processors to be registered with the app"""
    
    def inject_now():
        """Inject current datetime to templates"""
        return {'now': datetime.datetime.utcnow}
    
    return [inject_now]
