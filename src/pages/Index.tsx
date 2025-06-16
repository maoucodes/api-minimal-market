
import { Link } from "react-router-dom";
import { ArrowRight, Code, Zap, Shield, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            The API marketplace
            <br />
            <span className="text-gray-600">built for developers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover, integrate, and monetize APIs with our minimalist platform designed for modern development workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="inline-flex items-center px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors group"
            >
              Explore APIs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-3 border border-gray-300 text-black font-medium hover:bg-gray-50 transition-colors">
              Read Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Why choose apity?</h2>
            <p className="text-gray-600 text-lg">Everything you need to work with APIs, nothing you don't.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Developer First</h3>
              <p className="text-gray-600 text-sm">Built by developers, for developers. Clean docs and simple integration.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Optimized infrastructure ensuring sub-100ms response times globally.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Secure by Design</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade security with API key management and rate limiting.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Global Scale</h3>
              <p className="text-gray-600 text-sm">Worldwide CDN and edge computing for maximum performance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of developers building with apity.</p>
          <div className="bg-gray-50 p-8 font-mono text-sm text-left max-w-2xl mx-auto mb-8">
            <div className="text-gray-600 mb-2"># Install the apity CLI</div>
            <div className="text-black">npm install -g @apity/cli</div>
            <div className="text-gray-600 mt-4 mb-2"># Get your first API</div>
            <div className="text-black">apity get weather-api</div>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Start exploring
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-mono font-bold">apity</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
