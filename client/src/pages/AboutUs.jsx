import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

function AboutUs() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Info size={28} className="text-primary" />
            About Us
          </h1>
          <div className="h-1 w-20 bg-primary rounded"></div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-3">Our Mission</h2>
            <p className="text-muted-foreground">
              At VigiLynx, we strive to make the digital world a safer place for everyone. Our mission is to provide cutting-edge cybersecurity tools and resources that are accessible to individuals and organizations of all sizes.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-3">Who We Are</h2>
            <p className="text-muted-foreground mb-3">
              Founded in 2023, VigiLynx is a team of cybersecurity experts, engineers, and privacy advocates dedicated to developing innovative solutions to combat emerging cyber threats.
            </p>
            <p className="text-muted-foreground mb-3">
              We believe that everyone deserves to feel safe online, which is why we've created a comprehensive platform that combines threat detection, educational resources, and community support.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-3">Our Values</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize user privacy in everything we do. Your data is always protected with the highest security standards.
                </p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Cybersecurity tools should be accessible and understandable to everyone, regardless of technical expertise.
                </p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We constantly evolve to stay ahead of emerging threats, using the latest technologies and research.
                </p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Community</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in the power of community knowledge sharing to create a safer online environment for all.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-3">Our Team</h2>
            <p className="text-muted-foreground mb-4">
              Our diverse team brings together expertise from various fields including cybersecurity, machine learning, software development, and user experience design.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">SC</span>
                </div>
                <div>
                  <h3 className="font-medium">Sarah Chen</h3>
                  <p className="text-sm text-muted-foreground">CEO & Cybersecurity Specialist</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Former CISO with 15+ years experience in information security
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">MJ</span>
                </div>
                <div>
                  <h3 className="font-medium">Mark Johnson</h3>
                  <p className="text-sm text-muted-foreground">CTO & AI Researcher</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PhD in Computer Science with focus on ML and security
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">AP</span>
                </div>
                <div>
                  <h3 className="font-medium">Amina Patel</h3>
                  <p className="text-sm text-muted-foreground">Lead Security Engineer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Security engineer with expertise in threat intelligence
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">DO</span>
                </div>
                <div>
                  <h3 className="font-medium">David Okafor</h3>
                  <p className="text-sm text-muted-foreground">Head of User Experience</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    UX designer focused on making security accessible to all
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-3">Our Commitment</h2>
            <p className="text-muted-foreground mb-3">
              We are committed to helping individuals and organizations protect themselves from online threats through education, innovative tools, and community support.
            </p>
            <p className="text-muted-foreground">
              As cyber threats continue to evolve, our team remains dedicated to developing solutions that adapt to the changing landscape, ensuring that our users stay one step ahead of potential security risks.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutUs;