import { Sun, Cloud, CloudRain, Moon, Star } from 'lucide-react';

const greetings = [
  {
    message: "Hello Devansh, it looks like we're headed for a rainy evening today.",
    weather: "rainy",
    timeOfDay: "evening",
    icon: CloudRain,
    suggestion: "Perfect weather for that cozy cashmere sweater!"
  },
  {
    message: "Good morning Devansh! The sun is shining bright at 22°C.",
    weather: "sunny",
    timeOfDay: "morning",
    icon: Sun,
    suggestion: "Time to show off those light layers and your favorite accessories."
  },
  {
    message: "Hey there Devansh, it's looking quite cloudy this afternoon.",
    weather: "cloudy",
    timeOfDay: "afternoon", 
    icon: Cloud,
    suggestion: "A great day to experiment with that statement blazer."
  }
];

export function GreetingSection() {
  // For demo purposes, we'll use the first greeting
  const currentGreeting = greetings[0];
  const Icon = currentGreeting.icon;
  
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl p-8 md:p-12">
        <div className="flex items-start gap-4">
          {/* Weather Icon */}
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon className="h-6 w-6 text-accent-foreground" />
          </div>
          
          {/* Greeting Content */}
          <div className="flex-1">
            <h1 className="editorial-heading text-2xl md:text-3xl lg:text-4xl mb-3 text-foreground">
              {currentGreeting.message}
            </h1>
            <p className="ui-text text-base md:text-lg text-muted-foreground">
              {currentGreeting.suggestion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}