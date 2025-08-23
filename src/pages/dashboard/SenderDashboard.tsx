import { useState } from "react";
import { Package, Plus, Search, Filter, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useGetAllParcelsQuery, useCreateParcelMutation } from "@/store/api/parcelApi";
import { useAppSelector } from "@/hooks/redux";
import CreateParcelForm from "@/components/dashboard/CreateParcelForm";
import ParcelTable from "@/components/dashboard/ParcelTable";
import StatsCards from "@/components/dashboard/StatsCards";

const SenderDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: allParcels = [], isLoading } = useGetAllParcelsQuery();
  const [createParcel] = useCreateParcelMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter parcels for current sender
  const userParcels = allParcels.filter(parcel => 
    parcel.senderEmail === user?.email
  );

  const filteredParcels = userParcels.filter(parcel => {
    const matchesSearch = 
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || parcel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: userParcels.length,
    pending: userParcels.filter(p => p.status === 'pending').length,
    inTransit: userParcels.filter(p => p.status === 'in_transit').length,
    delivered: userParcels.filter(p => p.status === 'delivered').length,
    cancelled: userParcels.filter(p => p.status === 'cancelled').length,
  };

  const handleCreateParcel = async (parcelData: any) => {
    try {
      await createParcel({
        ...parcelData,
        senderEmail: user?.email,
        senderName: user?.name,
      }).unwrap();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create parcel:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white shadow-card border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Sender Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}! Manage your parcels and shipments.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 shadow-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Parcel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary">Create New Parcel</DialogTitle>
                </DialogHeader>
                <CreateParcelForm onSubmit={handleCreateParcel} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters and Search */}
        <Card className="card-gradient shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search by tracking ID, receiver name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parcels Table */}
        <Card className="card-gradient shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <Package className="w-6 h-6 mr-2" />
              My Parcels ({filteredParcels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ParcelTable 
              parcels={filteredParcels} 
              userRole="sender"
              showActions={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SenderDashboard;