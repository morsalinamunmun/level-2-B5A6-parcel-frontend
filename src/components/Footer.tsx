import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold">ParcelStride</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Fast, reliable, and secure parcel delivery service connecting senders and receivers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-primary-foreground/80 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/about" className="block text-primary-foreground/80 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link to="/contact" className="block text-primary-foreground/80 hover:text-white transition-colors text-sm">
                Contact
              </Link>
              <Link to="/track" className="block text-primary-foreground/80 hover:text-white transition-colors text-sm">
                Track Parcel
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>Same Day Delivery</p>
              <p>Express Shipping</p>
              <p>International Delivery</p>
              <p>Package Tracking</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>info@parcelstride.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>123 Delivery St, City, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 ParcelStride. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;