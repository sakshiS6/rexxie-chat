"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Shield, 
  Users, 
  Zap, 
  ArrowRight, 
  Star, 
  Globe,
  Smartphone,
  Lock,
  Sparkles
} from "lucide-react";

const LandingPage = () => {
  // Static features list
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Instant messaging with friends and colleagues",
      color: "text-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption for your conversations",
      color: "text-green-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Rexxie
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </a>
              <a href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
            <Globe className="w-4 h-4 mr-2" />
            India's Own Work Official Chat Box
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Chat Smarter,
            </span>
            <br />
            <span className="text-gray-900">Work Better</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience seamless communication with Rexxie - the modern chat platform designed for Indian businesses. 
            Connect, collaborate, and create with real-time messaging, file sharing, and powerful admin tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/login">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg px-8 py-3"
              >
                Start Chatting Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3 border-2"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rexxie?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and designed for the Indian workplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-2"
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Everything you need for modern communication
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rexxie combines the best features of modern chat applications with powerful admin tools designed specifically for Indian businesses.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl p-8 text-white">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Team Chat</p>
                      <p className="text-sm opacity-90">Real-time collaboration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Secure Messaging</p>
                      <p className="text-sm opacity-90">End-to-end encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Mobile Ready</p>
                      <p className="text-sm opacity-90">Works on all devices</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your communication?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust Rexxie for their daily communication needs.
          </p>
          <a href="/login">
            <Button 
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-orange-500 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Rexxie</span>
          </div>
          <p className="text-gray-400">
            © 2025 Rexxie. Made with ❤️ in India. Secure • Reliable • Modern
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
