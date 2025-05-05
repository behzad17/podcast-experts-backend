class CSPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add CSP header
        csp_policies = [
            "default-src 'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            # Allow Cloudinary images
            "img-src 'self' data: http://localhost:8000 http://127.0.0.1:8000 *.cloudinary.com res.cloudinary.com",
            # Allow local development servers
            "connect-src 'self' http://localhost:8000 http://localhost:3000 ws://localhost:8000 http://127.0.0.1:8000",
            # Allow styles
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            # Allow fonts
            "font-src 'self' https://fonts.gstatic.com",
            # Allow media
            "media-src 'self' *.cloudinary.com"
        ]
        
        response["Content-Security-Policy"] = "; ".join(csp_policies)
        return response 