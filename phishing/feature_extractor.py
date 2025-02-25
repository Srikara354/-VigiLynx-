import urllib.parse
import whois
import ssl
import socket
import datetime

class FeatureExtractor:
    def __init__(self):
        # You could add initialization logic here, like a cache for whois/SSL results
        self.cache = {}

    def extract_features(self, url):
        features = {}
        try:
            parsed_url = urllib.parse.urlparse(url)
            domain = parsed_url.netloc

            # Check cache first
            if domain in self.cache:
                return self.cache[domain]

            # Basic URL features
            features['url_len'] = len(url)
            features['hostname_len'] = len(parsed_url.netloc)

            # Whois lookup
            try:
                domain_info = whois.whois(domain)
                if domain_info.creation_date:
                    creation_date = domain_info.creation_date
                    if isinstance(creation_date, list):
                        creation_date = creation_date[0]
                    domain_age = (datetime.datetime.now() - creation_date).days
                    features['domain_age'] = max(0, domain_age)
                else:
                    features['domain_age'] = 0
            except Exception:
                features['domain_age'] = 0

            try:
                ip_address = socket.gethostbyname(domain)
                features['is_ip'] = 1 if ip_address == domain else 0
            except:
                features['is_ip'] = 0

            # Suspicious words
            suspicious_words = ['login', 'verify', 'secure', 'account', 'update', 'webscr', 'pay']
            features['suspicious_words'] = sum(url.lower().count(word) for word in suspicious_words)

            # SSL check (with timeout as per previous speedup suggestion)
            if parsed_url.scheme == 'https':
                try:
                    context = ssl.create_default_context()
                    with socket.create_connection((domain, 443), timeout=5) as sock:
                        with context.wrap_socket(sock, server_hostname=domain) as ssock:
                            cert = ssock.getpeercert()
                            features['ssl_valid'] = 1
                            expiry_date = datetime.datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                            features['cert_expiry_days'] = (expiry_date - datetime.datetime.now()).days
                except:
                    features['ssl_valid'] = 0
                    features['cert_expiry_days'] = 0
            else:
                features['ssl_valid'] = 0
                features['cert_expiry_days'] = 0

            # Cache the result
            self.cache[domain] = features
            return features

        except Exception as e:
            print(f"Error extracting features: {e}")
            return None

if __name__ == '__main__':
    # extractor = FeatureExtractor()
    # features = extractor.extract_features("https://example.com")
    # print(features)
    pass