
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary px-4 py-8">
        <div className="container max-w-7xl mx-auto space-y-8">
          {/* Navigation Bar */}
          <div className="glass-card p-2 rounded-full animate-fade-up">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem>
                  <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Centered Title and Theme Toggle */}
          <div className="flex flex-col items-center text-center animate-fade-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 pb-1">
              Contact Us
            </h1>
            <p className="mt-1 text-xl text-muted-foreground">
              Get in touch with our team
            </p>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="glass-card p-8 max-w-3xl mx-auto animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Reach Out</h2>
                <p className="text-muted-foreground">
                  We're here to help with any questions or feedback about ProcLens.ai.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" />
                    <span>rishiraj_connect@outlook.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" />
                    <span>+9031094287</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary" />
                    <span>Gammma 1 E90, Greater Noida</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-medium mb-4">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="glass-input w-full px-3 py-2"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="glass-input w-full px-3 py-2"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="glass-input w-full px-3 py-2"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
          
          <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-up">
            <p>ProcLens.ai — Elegant system monitoring</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Contact;
