import { useState } from "react";
import { Package, Users, Search, Filter, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllParcelsQuery, useGetAllUsersQuery } from "@/store/api/parcelApi";
import { useAppSelector } from "@/hooks/redux";
import ParcelTable from "@/components/dashboard/ParcelTable";
import UserTable from "@/components/dashboard/UserTable";
import StatsCards from "@/components/dashboard/StatsCards";

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: allParcels = [], isLoading: parcelsLoading } = useGetAllParcelsQuery();
  const { data: allUsers = [], isLoading: usersLoading } = useGetAllUsersQuery();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const filteredParcels = allParcels.filter(parcel => {
    const matchesSearch = 
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || parcel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = userFilter === "all" || user.role === userFilter;
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: allParcels.length,
    pending: allParcels.filter(p => p.status === 'pending').length,
    inTransit: allParcels.filter(p => p.status === 'in_transit').length,
    delivered: allParcels.filter(p => p.status === 'delivered').length,
    cancelled: allParcels.filter(p => p.status === 'cancelled').length,
  };

  const userStats = {
    total: allUsers.length,
    senders: allUsers.filter(u => u.role === 'sender').length,
    receivers: allUsers.filter(u => u.role === 'receiver').length,
    admins: allUsers.filter(u => u.role === 'admin').length,
    active: allUsers.filter(u => u.status === 'active').length,
    blocked: allUsers.filter(u => u.status === 'blocked').length,
  };

  if (parcelsLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}! Manage users and parcels system-wide.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-2xl font-bold text-primary">{allUsers.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Parcels</div>
                <div className="text-2xl font-bold text-primary">{allParcels.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Parcels</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-primary">{userStats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold text-primary">{stats.inTransit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-success-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-primary">{stats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="parcels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parcels" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Parcels Management</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parcels" className="space-y-6">
            {/* Parcel Filters */}
            <Card className="card-gradient shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Search parcels by tracking ID, sender, or receiver..."
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
                  All Parcels ({filteredParcels.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ParcelTable 
                  parcels={filteredParcels} 
                  userRole="admin"
                  showActions={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Filters */}
            <Card className="card-gradient shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All Roles</option>
                      <option value="sender">Sender</option>
                      <option value="receiver">Receiver</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="card-gradient shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  All Users ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserTable users={filteredUsers} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;