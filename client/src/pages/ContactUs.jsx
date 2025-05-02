import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

function ContactUs() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Mail size={28} className="text-primary" />
            Contact Us
          </h1>
          <div className="h-1 w-20 bg-primary rounded"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <p className="text-muted-foreground">
              We're here to help and answer any question you might have. We look forward to hearing from you!
            </p>
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="rounded-full bg-success flex items-center justify-center p-1">
                  <Check size={16} className="text-white" />
                </div>
                <p className="text-success">Your message has been sent successfully. We'll get back to you soon!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formState.subject}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunities</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows="5"
                    className="input w-full"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={`btn btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '' : (
                    <>
                      <Send size={16} className="mr-2" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-4">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <a href="mailto:support@vigilynx.com" className="text-sm text-primary hover:underline">
                      support@vigilynx.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href="tel:+15551234567" className="text-sm text-primary hover:underline">
                      +1 (555) 123-4567
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monday-Friday, 9am-5pm PST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-sm text-muted-foreground">
                      123 Security Ave, Suite 400<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-4">FAQ</h2>
              <div className="space-y-3">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">What services does VigiLynx offer?</h3>
                  <p className="text-sm text-muted-foreground">
                    We provide cybersecurity solutions including threat detection, vulnerability assessments, and educational resources.
                  </p>
                </div>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">How can I report a security issue?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can contact our security team directly at security@vigilynx.com for urgent matters.
                  </p>
                </div>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">Do you offer enterprise solutions?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we provide customized cybersecurity solutions for businesses of all sizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactUs;