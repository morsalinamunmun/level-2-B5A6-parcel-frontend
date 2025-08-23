import { useState } from "react";
import { Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateParcelFormProps {
  onSubmit: (parcelData: any) => Promise<void>;
}

const CreateParcelForm = ({ onSubmit }: CreateParcelFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    receiverAddress: "",
    senderPhone: "",
    senderAddress: "",
    parcelType: "",
    weight: "",
    price: "",
    deliveryDate: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        'receiverName', 'receiverEmail', 'receiverPhone', 'receiverAddress',
        'senderPhone', 'senderAddress', 'parcelType', 'weight', 'price', 'deliveryDate'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.receiverEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid receiver email address.",
          variant: "destructive",
        });
        return;
      }

      // Validate weight and price are positive numbers
      const weight = parseFloat(formData.weight);
      const price = parseFloat(formData.price);
      
      if (isNaN(weight) || weight <= 0) {
        toast({
          title: "Invalid Weight",
          description: "Weight must be a positive number.",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Price must be a positive number.",
          variant: "destructive",
        });
        return;
      }

      // Validate delivery date is in the future
      const deliveryDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deliveryDate <= today) {
        toast({
          title: "Invalid Delivery Date",
          description: "Delivery date must be in the future.",
          variant: "destructive",
        });
        return;
      }

      await onSubmit({
        ...formData,
        weight: weight,
        price: price,
        status: 'pending'
      });

      toast({
        title: "Parcel Created",
        description: "Your parcel has been created successfully and is now pending.",
      });

      // Reset form
      setFormData({
        receiverName: "",
        receiverEmail: "",
        receiverPhone: "",
        receiverAddress: "",
        senderPhone: "",
        senderAddress: "",
        parcelType: "",
        weight: "",
        price: "",
        deliveryDate: ""
      });

    } catch (error) {
      toast({
        title: "Failed to Create Parcel",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sender Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Sender Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderPhone">Phone Number *</Label>
            <Input
              id="senderPhone"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="senderAddress">Address *</Label>
            <Textarea
              id="senderAddress"
              name="senderAddress"
              value={formData.senderAddress}
              onChange={handleInputChange}
              placeholder="Enter your complete address..."
              className="min-h-[80px] resize-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Receiver Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Receiver Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="receiverName">Full Name *</Label>
            <Input
              id="receiverName"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleInputChange}
              placeholder="Receiver's full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiverEmail">Email Address *</Label>
            <Input
              id="receiverEmail"
              name="receiverEmail"
              type="email"
              value={formData.receiverEmail}
              onChange={handleInputChange}
              placeholder="receiver@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiverPhone">Phone Number *</Label>
            <Input
              id="receiverPhone"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="deliveryDate">Delivery Date *</Label>
            <div className="relative">
              <Input
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="receiverAddress">Address *</Label>
            <Textarea
              id="receiverAddress"
              name="receiverAddress"
              value={formData.receiverAddress}
              onChange={handleInputChange}
              placeholder="Enter receiver's complete address..."
              className="min-h-[80px] resize-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Parcel Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Parcel Details</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parcelType">Parcel Type *</Label>
            <Input
              id="parcelType"
              name="parcelType"
              value={formData.parcelType}
              onChange={handleInputChange}
              placeholder="e.g., Documents, Electronics"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="0.5"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="25.00"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-primary hover:opacity-90 shadow-primary"
          size="lg"
        >
          {isSubmitting ? "Creating..." : "Create Parcel"}
        </Button>
      </div>
    </form>
  );
};

export default CreateParcelForm;