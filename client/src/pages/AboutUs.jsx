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
            We're four undergrad tech rebels on a mission to lock down the web for everyone. Our crew thrives on sharing cutting-edge hacks and teaming up to squash digital threats, crafting a bulletproof online universe.
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
                  <span className="text-lg font-bold text-primary">HB</span>
                </div>
                <div>
                  <h3 className="font-medium">S Harsha Bhat</h3>
                  <p className="text-sm text-muted-foreground">Cybersecurity Specialist</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Security engineer with a determination to make the web a safer place
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">SS</span>
                </div>
                <div>
                  <h3 className="font-medium">G Shreyas Shetty</h3>
                  <p className="text-sm text-muted-foreground">AI Researcher</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Machine learning engineer with a focus on cybersecurity
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">KP</span>
                </div>
                <div>
                  <h3 className="font-medium">Keerthan Poovaiah M M</h3>
                  <p className="text-sm text-muted-foreground">Backend Engineer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Software developer with a passion for cybersecurity and privacy
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">SK</span>
                </div>
                <div>
                  <h3 className="font-medium">Srikara K</h3>
                  <p className="text-sm text-muted-foreground">UI UX specialist</p>
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