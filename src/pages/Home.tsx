import { Link } from "react-router-dom";
import { Package, Truck, Shield, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Lightning-fast delivery with real-time tracking across the globe."
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your parcels are protected with end-to-end security and insurance."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your delivery needs."
    },
    {
      icon: CheckCircle,
      title: "Reliable Service",
      description: "99.9% successful delivery rate with guaranteed satisfaction."
    }
  ];

  const stats = [
    { value: "50K+", label: "Parcels Delivered" },
    { value: "1000+", label: "Happy Customers" },
    { value: "25+", label: "Cities Covered" },
    { value: "99.9%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Fast & Reliable
              <span className="block text-accent">Parcel Delivery</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Send and receive parcels with confidence. Track your packages in real-time 
              and enjoy seamless delivery experiences worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elevated">
                <Link to="/register" className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg"  className="!border-white !text-white hover:!bg-white/10">
                <Link to="/track" className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Track Package</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Why Choose ParcelStride?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium delivery services designed for your convenience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to Send Your First Package?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of satisfied customers who trust ParcelStride for their delivery needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/register">Create Account</Link>
              </Button>
              <Button size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;