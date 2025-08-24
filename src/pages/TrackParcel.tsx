import { useState } from "react";
import { Search, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const TrackParcel = () => {
  const { toast } = useToast();
  const [trackingId, setTrackingId] = useState("");
  const [searchedId, setSearchedId] = useState("");

  const { data: parcel, isLoading, error } = useState(searchedId, {
    skip: !searchedId,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast({
        title: "Invalid Tracking ID",
        description: "Please enter a valid tracking ID.",
        variant: "destructive",
      });
      return;
    }
    setSearchedId(trackingId.trim());
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-primary" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "secondary";
      case 'in_transit':
        return "default";
      case 'delivered':
        return "default";
      case 'cancelled':
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6">Track Your Parcel</h1>
          <p className="text-xl text-muted-foreground">
            Enter your tracking ID to get real-time updates on your parcel's journey
          </p>
        </div>

        {/* Search Form */}
        <Card className="card-gradient shadow-elevated mb-12">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="tracking" className="text-sm font-medium text-foreground">
                  Tracking ID
                </label>
                <div className="flex space-x-4">
                  <Input
                    id="tracking"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your tracking ID (e.g., PS123456789)"
                    className="h-12 flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-primary hover:opacity-90 shadow-primary px-8"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isLoading ? "Searching..." : "Track"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 text-destructive">
                <XCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Parcel Not Found</h3>
                  <p className="text-sm">Please check your tracking ID and try again.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {parcel && (
          <div className="space-y-8">
            {/* Parcel Overview */}
            <Card className="card-gradient shadow-elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-primary flex items-center space-x-3">
                    <Package className="w-8 h-8" />
                    <span>Tracking ID: {parcel.trackingId}</span>
                  </CardTitle>
                  <Badge variant={getStatusBadgeVariant(parcel.status)} className="text-sm px-3 py-1">
                    {parcel.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Sender Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Sender Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {parcel.senderName}</p>
                      <p><span className="font-medium">Email:</span> {parcel.senderEmail}</p>
                      <p><span className="font-medium">Phone:</span> {parcel.senderPhone}</p>
                      <p><span className="font-medium">Address:</span> {parcel.senderAddress}</p>
                    </div>
                  </div>

                  {/* Receiver Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Receiver Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {parcel.receiverName}</p>
                      <p><span className="font-medium">Email:</span> {parcel.receiverEmail}</p>
                      <p><span className="font-medium">Phone:</span> {parcel.receiverPhone}</p>
                      <p><span className="font-medium">Address:</span> {parcel.receiverAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Parcel Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Parcel Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Type:</span>
                      <p className="text-foreground">{parcel.parcelType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Weight:</span>
                      <p className="text-foreground">{parcel.weight} kg</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Price:</span>
                      <p className="text-foreground">${parcel.price}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Delivery Date:</span>
                      <p className="text-foreground">{new Date(parcel.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="card-gradient shadow-elevated">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcel.statusHistory?.map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground capitalize">
                            {log.status.replace('_', ' ')}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-sm text-muted-foreground">{log.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated by: {log.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-gradient-secondary text-secondary-foreground shadow-elevated mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
            <p className="text-secondary-foreground/80 mb-6">
              If you can't find your parcel or have questions about tracking, 
              our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-secondary-accent text-secondary-accent hover:bg-secondary-accent/10">
                Contact Support
              </Button>
              <Button variant="outline" className="border-secondary-accent text-secondary-accent hover:bg-secondary-accent/10">
                FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackParcel;