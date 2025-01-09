import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-[#1A1F26] text-white w-full mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="grid md:grid-cols-2 gap-8 pb-12 border-b border-gray-700">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2">Stay Informed</h3>
            <p className="text-gray-300">Get the latest opinions and analysis delivered to your inbox</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button className="bg-accent hover:bg-accent/90">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">About Us</h4>
            <p className="text-gray-300 mb-4">
              Leading platform for in-depth analysis and diverse perspectives on today's most pressing issues.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-accent">Politics</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Technology</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Culture</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Economics</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Environment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-accent">Write for Us</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Editorial Guidelines</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-accent">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                contact@newsopinions.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NewsOpinions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
