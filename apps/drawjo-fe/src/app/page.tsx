"use client"

import React, { useState, useEffect } from 'react';
import { Pencil, Users, Zap, Globe, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@repo/ui/Button';
import Link from 'next/link';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-Time Collaboration",
      description: "Draw together with your team in real-time. See cursors, edits, and changes as they happen."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Built for speed and performance. No lag, no delays - just smooth drawing."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Works Everywhere",
      description: "Browser-based tool that works on any device. No installation required."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Intuitive Interface",
      description: "Clean, simple design inspired by Excalidraw. Start drawing in seconds."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-5"
            style={{
              width: Math.random() * 300 + 50 + 'px',
              height: Math.random() * 300 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-sm bg-white/10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Pencil className="w-8 h-8" />
              </div>
              <span className="text-3xl font-bold">Drawjo</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-purple-200 transition-colors font-medium">Features</a>
              <a href="#pricing" className="hover:text-purple-200 transition-colors font-medium">Pricing</a>
              <a href="#about" className="hover:text-purple-200 transition-colors font-medium">About</a>
              <Button appName='crazy' className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition-all hover:scale-105 shadow-lg">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              appName='crazy'
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <a href="#features" className="hover:text-purple-200 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-purple-200 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-purple-200 transition-colors">About</a>
              <Button appName='crazy' className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition-all">
                Get Started
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-32 pb-20 text-center">
        <div 
          className="animate-fade-in-up"
          style={{ 
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: 1 - scrollY / 500 
          }}
        >
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold">✨ Collaborative Drawing Made Simple</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Draw Together.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-300">
              Create Magic.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-3xl mx-auto leading-relaxed">
            The collaborative whiteboard built for teams who want to sketch, brainstorm, and visualize ideas together in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={'/singin'}>
            <Button appName='crazy' className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all hover:scale-105 shadow-2xl hover:shadow-purple-500/50">
              SignIn
            </Button>
            </Link>
            <Link href={'/signup'}>
            <Button appName='crazy' className="bg-white/20 backdrop-blur-sm border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all">
              Signup
            </Button>
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-20 relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Pencil className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-2xl font-semibold opacity-75">Your Canvas Awaits</p>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-10 -left-10 bg-yellow-300 w-20 h-20 rounded-2xl rotate-12 opacity-80 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute -bottom-10 -right-10 bg-pink-300 w-16 h-16 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -right-5 bg-blue-300 w-12 h-12 rounded-lg -rotate-12 opacity-80 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative bg-white text-gray-900 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why Teams Love Drawjo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to collaborate visually, without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-purple-100"
              >
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20">
            <h2 className="text-5xl font-bold mb-6">Ready to Start Drawing?</h2>
            <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
              Join thousands of teams already collaborating on Drawjo. No credit card required.
            </p>
            <Button appName='crazy' className="bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-purple-50 transition-all hover:scale-105 shadow-2xl">
              Create Your First Board
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/20 backdrop-blur-sm py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pencil className="w-6 h-6" />
                <span className="text-xl font-bold">Drawjo</span>
              </div>
              <p className="text-purple-200">Collaborative drawing for modern teams</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <div className="flex flex-col gap-2 text-purple-200">
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Updates</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="flex flex-col gap-2 text-purple-200">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="flex flex-col gap-2 text-purple-200">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-purple-200">
            <p>&copy; 2025 Drawjo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
