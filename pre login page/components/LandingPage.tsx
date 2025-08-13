import { ArrowRight, Sparkles, Calendar, Palette, TrendingUp, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onLogin, onSignUp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="ui-text text-primary-foreground font-medium">V</span>
              </div>
              <span className="editorial-heading text-xl">Vera</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onLogin} className="ui-text">
                Sign In
              </Button>
              <Button onClick={onSignUp} className="ui-text">
                Get Started
              </Button>
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
                <Badge variant="secondary" className="ui-text">
                  For Modern Professional Women
                </Badge>
                <h1 className="editorial-heading text-4xl lg:text-5xl">
                  Your Smart Styling
                  <br />
                  <span className="text-accent">Companion</span>
                </h1>
                <p className="ui-text text-lg text-muted-foreground leading-relaxed">
                  Transform your daily dressing routine with AI-powered outfit recommendations, 
                  smart wardrobe organization, and personalized styling insights designed for 
                  busy professional women.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onSignUp}
                  className="ui-text group"
                >
                  Start Your Style Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={onLogin}
                  className="ui-text"
                >
                  Sign In
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="ui-text text-sm text-muted-foreground">4.9/5</span>
                </div>
                <div className="ui-text text-sm text-muted-foreground">
                  Trusted by 10,000+ professional women
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 border-accent/20">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=400&fit=crop"
                        alt="Professional outfit suggestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ui-text text-sm">
                      <p className="font-medium">Today's Pick</p>
                      <p className="text-muted-foreground text-xs">Perfect for client meetings</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop"
                        alt="Casual outfit suggestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ui-text text-sm">
                      <p className="font-medium">Weekend Chic</p>
                      <p className="text-muted-foreground text-xs">Comfortable & stylish</p>
                    </div>
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="p-4">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop"
                        alt="Business outfit suggestion"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ui-text text-sm">
                      <p className="font-medium">Power Lunch</p>
                      <p className="text-muted-foreground text-xs">Confidence in every detail</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-secondary to-muted border-border/50">
                    <div className="text-center py-6">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="ui-text text-sm font-medium">AI-Curated</p>
                      <p className="ui-text text-xs text-muted-foreground">Just for you</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="editorial-heading text-3xl mb-4">
              Designed for Your Lifestyle
            </h2>
            <p className="ui-text text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature is crafted to save you time and elevate your style, 
              so you can focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="ui-text font-medium mb-2">{feature.title}</h3>
                  <p className="ui-text text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="editorial-heading text-3xl mb-4">
              Loved by Professional Women
            </h2>
            <p className="ui-text text-lg text-muted-foreground">
              See how Vera is transforming morning routines across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="ui-text text-sm leading-relaxed mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <p className="ui-text font-medium text-sm">{testimonial.name}</p>
                  <p className="ui-text text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="editorial-heading text-3xl mb-4">
            Ready to Revolutionize Your Style?
          </h2>
          <p className="ui-text text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of professional women who've already transformed their 
            daily dressing routine with Vera's intelligent styling platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={onSignUp}
              className="ui-text group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onLogin}
              className="ui-text border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Sign In
            </Button>
          </div>

          <p className="ui-text text-sm opacity-70 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="ui-text text-primary-foreground text-sm">V</span>
              </div>
              <span className="editorial-heading">Vera</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="ui-text text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="ui-text text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="ui-text text-sm text-muted-foreground hover:text-foreground">
                Support
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="ui-text text-xs text-muted-foreground">
              © 2024 Vera. Designed for the modern professional woman.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}