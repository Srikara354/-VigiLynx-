import urllib.parse
from urllib.parse import urlparse, parse_qs
import whoisdomain
import ssl
import socket
import datetime

class FeatureExtractor:
    def __init__(self):
        # You could add initialization logic here, like a cache for whois/SSL results
        self.cache = {}
        self.keyword = set(["account","bank","billing","balance","card","credit","debit","money","payment","refund","transaction","update","verify","wire","wallet","secure","security","loan","invest","savings",
"alert","urgent","warning","notice","danger","fraud","suspension","blocked","expired","verify-now","login-fail","risk","immediate-action","restricted","hacked","unauthorized","critical","emergency","restore","problem",
"support","helpdesk","microsoft","windows","antivirus","firewall","malware","trojan","spyware","ransom","repair","recover","fix-now","scanner","troubleshoot","patch","IT-support","tech-alert","system-error","update-required",
"google","gmail","facebook","instagram","twitter","whatsapp","youtube","netflix","amazon","paypal","apple","icloud","outlook","office365","dropbox","linkedin","ebay","spotify","zoom","snapchat",
"login","signin","confirm","validate","auth","token","credential","pass-reset","unlock","MFA","OTP","authentication","access","password","user-ID","signon","reconnect","reactivation","identity","credentials-check",
"free","claim","prize","winner","lottery","sweepstakes","reward","contest","bonus","cashout","promo","lucky","congratulations","exclusive-offer","gift","redeem","special-offer","jackpot","scratch-card","instant-win",
"order","delivery","shipping","track","package","invoice","receipt","shopping","checkout","cart","tracking-id","shipment","express-delivery","fedex","dhl","ups","amazon-shipment","pending-order","verify-order","customs-clearance",
"tax","irs","refund","stimulus","treasury","federal","lawsuit","police","attorney","court","social-security","benefits","unemployment","grant","gov-relief","pension","medical-bill","healthcare","legal-notice","subpoena",
"work-from-home","career","hiring","resume","job-offer","recruitment","HR","vacancy","internship","part-time","apply-now","salary","freelance","consultant","gig","employer","hiring-bonus","job-alert","HR-department","work-opportunity",
"bitcoin","crypto","ethereum","blockchain","NFT","mining","forex","trading","invest-now","high-returns","staking","token-sale","exchange","wallet-access","airdrop","metaverse","ICO","crypto-giveaway","financial-freedom","wealth-opportunity",
"secure-login","websecure","account-update","official-support","verify-info","confirm-now","reset-password","emergency-access","email-verification","secure-access","authentication-required","security-alert","fake-captcha","account-recovery","verify-email","privacy-check","account-protection","suspicious-activity","payment-failure","unauthorized-access",
"-secure.com","-verify.net","-login.co","-auth.info","-banking.org","-signin.xyz","-customer-support.io","-helpdesk.cc","-cloudsecurity.vip","-wallet.app","-mfa-login.co","-accountalert.biz","-quickupdate.pro","-password-reset.cloud","-urgentnotice.site","-gov-update.agency","-billingverification.services","-trackorder.live","-amazon-support.email","-legalaction.team",
"myaccount","secure-service","webmail","emailaccess","paypal-service","amazon-secure","refundrequest","gov-refund","bank-secure","confirm-billing"
])
    def extract_features(self, url):
        features = {}
        try:
            count = sum(1 for word in self.keyword if word in url)
            features['keyword_count'] = count
        except:
            features['keyword_count'] = 0
        
        try:
            parsed_url = urllib.parse.urlparse(url)
            domain = parsed_url.netloc
            hostname = parsed_url.hostname
            domain_parts = domain.split('.')
            query_params = parse_qs(parsed_url.query)
            
            # Check cache first
            if domain in self.cache:
                return self.cache[domain]

            # Basic URL features
            features['url_len'] = len(url)
            features['hostname_len'] = len(parsed_url.netloc)
            features['domain_parts'] = len(domain_parts) - 2
            features['query_parts'] = len(parsed_url.query.split('&'))
            features['fragment_parts'] = len(parsed_url.fragment.split('&'))
            features['query_parameters'] = len(query_params)
            # Whois lookup
            try:
                domain_info = whoisdomain.query(domain)
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
    pass