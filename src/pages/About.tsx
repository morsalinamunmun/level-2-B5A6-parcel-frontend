import { Package, Users, Globe, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Package,
      title: "Quality Service",
      description: "We ensure every parcel is handled with the utmost care and delivered safely to its destination."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. Their satisfaction is our top priority."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "From local deliveries to international shipping, we connect people across the world."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service delivery and customer experience."
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-primary mb-6">About ParcelStride</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the parcel delivery industry with innovative technology, 
            reliable service, and a commitment to connecting people worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At ParcelStride, we believe that distance should never be a barrier to connection. 
              Our mission is to provide fast, reliable, and secure parcel delivery services that 
              bring people closer together, whether they're across the street or across the globe.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We leverage cutting-edge technology to ensure transparency, security, and efficiency 
              in every delivery, while maintaining the personal touch that makes each package special.
            </p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-8 shadow-elevated">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Trusted by Thousands</h3>
              <p className="text-muted-foreground">
                Over 50,000 successful deliveries and counting, with a 99.9% customer satisfaction rate.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the way we serve our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-gradient shadow-card hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-secondary-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-muted/30 rounded-2xl p-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded in 2020, ParcelStride emerged from a simple idea: parcel delivery should be 
              easy, transparent, and reliable. What started as a local delivery service has grown 
              into a comprehensive logistics platform serving customers worldwide.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we're proud to be at the forefront of the logistics industry, combining 
              traditional delivery excellence with modern technology to create an unmatched 
              customer experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;