import React from 'react';
import { Github, Heart, Linkedin, Mail } from 'lucide-react';

function Footer() {
    return (
        <footer className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 py-8 px-4 border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500">
                            RentOrbit
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600 text-sm">
                            Find your perfect space
                        </span>
                    </div>
                    
                    <div className="flex space-x-6">
                        <a 
                            href="https://github.com/princetiwari26/rentorbit" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                            aria-label="GitHub Repository"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a 
                            href="https://linkedin.com/in/princetiwari26" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-orange-600 transition-colors"
                            aria-label="LinkedIn Profile"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a 
                            href="mailto:princetiwari.profes@gmail.com" 
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © 2025 RentOrbit. All rights reserved.
                    </p>
                    
                    <div className="py-1 px-2 flex items-center text-sm rounded-lg text-white bg-gradient-to-r from-orange-600 to-purple-600">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" />
                        <span>by Prince Tiwari</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;