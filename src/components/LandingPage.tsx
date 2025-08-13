'use client';

import { ArrowRight, Sparkles, Calendar, Palette, TrendingUp, Star } from 'lucide-react';
import { signIn } from 'next-auth/react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Styling',
    description: 'Get personalized outfit recommendations based on your wardrobe, weather, and schedule.',
  },
  {
    icon: Calendar,
    title: 'Smart Planning',
    description: 'Plan outfits in advance and never worry about what to wear to important meetings.',
  },
  {
    icon: Palette,
    title: 'Digital Wardrobe',
    description: 'Organize your clothing digitally and discover new combinations you never considered.',
  },
  {
    icon: TrendingUp,
    title: 'Style Analytics',
    description: 'Track your wearing patterns and optimize your wardrobe for maximum versatility.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director',
    content: 'Vera has completely transformed my morning routine. I used to spend 20 minutes deciding what to wear, now it takes me 2 minutes.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Product Manager',
    content: 'The AI suggestions are incredibly accurate. It feels like having a personal stylist who knows my schedule and preferences.',
    rating: 5,
  },
  {
    name: 'Jessica Liu',
    role: 'Consultant',
    content: 'I love how Vera helps me make the most of pieces I already own. I\'ve discovered so many new outfit combinations.',
    rating: 5,
  },
];

export function LandingPage() {
  const handleSignIn = () => {
    signIn();
  };

  const handleSignUp = () => {
    signIn();
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#fdfcfa]/80 backdrop-blur-sm border-b border-[rgba(45,41,38,0.1)] z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2d2926] rounded-full flex items-center justify-center">
                <span className="text-[#fdfcfa] font-medium font-inter">V</span>
              </div>
              <span className="text-xl font-playfair font-normal text-[#2d2926]">Vera</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSignIn}
                className="px-4 py-2 text-[#2d2926] hover:bg-[#f5f4f2] rounded-md transition-colors font-inter font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={handleSignUp}
                className="px-4 py-2 bg-[#2d2926] text-[#fdfcfa] rounded-md hover:bg-[#2d2926]/90 transition-colors font-inter font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-[#f5f4f2] text-[#2d2926] rounded-full text-sm font-inter font-medium">
                  For Modern Professional Women
                </span>
                <h1 className="text-4xl lg:text-5xl font-playfair font-normal text-[#2d2926] leading-tight">
                  Your Smart Styling
                  <br />
                  <span className="text-[#e8c5a0]">Companion</span>
                </h1>
                <p className="text-lg text-[#8b8681] leading-relaxed font-inter font-normal">
                  Transform your daily dressing routine with AI-powered outfit recommendations, 
                  smart wardrobe organization, and personalized styling insights designed for 
                  busy professional women.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleSignUp}
                  className="px-6 py-3 bg-[#2d2926] text-[#fdfcfa] rounded-md hover:bg-[#2d2926]/90 transition-colors font-inter font-medium group flex items-center justify-center"
                >
                  Start Your Style Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleSignIn}
                  className="px-6 py-3 border border-[rgba(45,41,38,0.1)] bg-[#fdfcfa] text-[#2d2926] rounded-md hover:bg-[#f5f4f2] transition-colors font-inter font-medium"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#e8c5a0] text-[#e8c5a0]" />
                    ))}
                  </div>
                  <span className="text-sm text-[#8b8681] font-inter font-normal">4.9/5</span>
                </div>
                <div className="text-sm text-[#8b8681] font-inter font-normal">
                  Trusted by 10,000+ professional women
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-[#e8c5a0]/20 to-[#e8c5a0]/10 border border-[#e8c5a0]/20 rounded-xl">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=400&fit=crop"
                        alt="Professional outfit suggestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-inter font-normal">
                      <p className="font-medium text-[#2d2926]">Today's Pick</p>
                      <p className="text-[#8b8681] text-xs">Perfect for client meetings</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-[rgba(45,41,38,0.1)] rounded-xl">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop"
                        alt="Casual outfit suggestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-inter font-normal">
                      <p className="font-medium text-[#2d2926]">Weekend Chic</p>
                      <p className="text-[#8b8681] text-xs">Comfortable & stylish</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="p-4 bg-white border border-[rgba(45,41,38,0.1)] rounded-xl">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop"
                        alt="Business outfit suggestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-inter font-normal">
                      <p className="font-medium text-[#2d2926]">Power Lunch</p>
                      <p className="text-[#8b8681] text-xs">Confidence in every detail</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#f5f4f2] to-[#f0efed] border border-[rgba(45,41,38,0.1)] rounded-xl">
                    <div className="text-center py-6">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-[#e8c5a0]" />
                      <p className="text-sm font-medium font-inter font-normal text-[#2d2926]">AI-Curated</p>
                      <p className="text-xs text-[#8b8681] font-inter font-normal">Just for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#f5f4f2]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 font-playfair font-normal text-[#2d2926]">
              Designed for Your Lifestyle
            </h2>
            <p className="text-lg text-[#8b8681] max-w-2xl mx-auto font-inter font-normal">
              Every feature is crafted to save you time and elevate your style, 
              so you can focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 bg-white border border-[rgba(45,41,38,0.1)] rounded-xl text-center hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="w-12 h-12 mx-auto bg-[#e8c5a0]/20 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-[#e8c5a0]" />
                    </div>
                  </div>
                  <h3 className="font-medium mb-2 font-inter font-medium text-[#2d2926]">{feature.title}</h3>
                  <p className="text-sm text-[#8b8681] leading-relaxed font-inter font-normal">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 font-playfair font-normal text-[#2d2926]">
              Loved by Professional Women
            </h2>
            <p className="text-lg text-[#8b8681] font-inter font-normal">
              See how Vera is transforming morning routines across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white border border-[rgba(45,41,38,0.1)] rounded-xl">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#e8c5a0] text-[#e8c5a0]" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed mb-4 font-inter font-normal text-[#2d2926]">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <p className="font-medium text-sm font-inter font-medium text-[#2d2926]">{testimonial.name}</p>
                  <p className="text-xs text-[#8b8681] font-inter font-normal">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-[#2d2926] text-[#fdfcfa]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-4 font-playfair font-normal">
            Ready to Revolutionize Your Style?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto font-inter font-normal">
            Join thousands of professional women who've already transformed their 
            daily dressing routine with Vera's intelligent styling platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleSignUp}
              className="px-6 py-3 bg-[#f5f4f2] text-[#2d2926] rounded-md hover:bg-[#f5f4f2]/80 transition-colors font-inter font-medium group flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleSignIn}
              className="px-6 py-3 border border-[#fdfcfa] bg-transparent text-[#fdfcfa] rounded-md hover:bg-[#fdfcfa] hover:text-[#2d2926] transition-colors font-inter font-medium"
            >
              Sign In
            </button>
          </div>

          <p className="text-sm opacity-70 mt-6 font-inter font-normal">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[rgba(45,41,38,0.1)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#2d2926] rounded-full flex items-center justify-center">
                <span className="text-[#fdfcfa] text-sm font-inter font-medium">V</span>
              </div>
              <span className="font-playfair font-normal text-[#2d2926]">Vera</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[#8b8681] hover:text-[#2d2926] font-inter font-normal">
                Privacy
              </a>
              <a href="#" className="text-sm text-[#8b8681] hover:text-[#2d2926] font-inter font-normal">
                Terms
              </a>
              <a href="#" className="text-sm text-[#8b8681] hover:text-[#2d2926] font-inter font-normal">
                Support
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(45,41,38,0.1)] text-center">
            <p className="text-xs text-[#8b8681] font-inter font-normal">
              © 2024 Vera. Designed for the modern professional woman.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 