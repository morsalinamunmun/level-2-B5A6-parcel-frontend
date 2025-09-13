import { useEffect, useState } from "react";
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
import { useGetMyParcelsQuery, useCreateParcelMutation, useGetAllUsersQuery, User } from "@/store/api/parcelApi";
import { useAppSelector } from "@/hooks/redux";
import CreateParcelForm from "@/components/dashboard/CreateParcelForm";
import ParcelTable from "@/components/dashboard/ParcelTable";
import StatsCards from "@/components/dashboard/StatsCards";

const SenderDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: userParcels = [], isLoading } = useGetMyParcelsQuery();
  const [createParcel] = useCreateParcelMutation();
   const { data: allUsers } = useGetAllUsersQuery();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
   const [receiverOptions, setReceiverOptions] = useState<Array<{ _id: string; name: string; email: string }>>([]);

  // Filter users to get only receivers
  useEffect(() => {
    if (allUsers?.data) {
      const receivers = allUsers.data.filter((user: User) => user.role === 'receiver');
      setReceiverOptions(receivers);
    }
  }, [allUsers]);

  const filteredParcels = userParcels?.data?.filter(parcel => {
    const matchesSearch = 
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverId.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || parcel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: userParcels?.data?.length,
    pending: userParcels?.data?.filter(p => p.status === 'pending').length,
    inTransit: userParcels?.data?.filter(p => p.status === 'in_transit').length,
    delivered: userParcels?.data?.filter(p => p.status === 'delivered').length,
    cancelled: userParcels?.data?.filter(p => p.status === 'cancelled').length,
  };

  // const handleCreateParcel = async (parcelData: any) => {
  //   try {
  //     await createParcel(parcelData).unwrap();
  //     setIsCreateDialogOpen(false);
  //   } catch (error) {
  //     console.error('Failed to create parcel:', error);
  //   }
  // };

   const handleCreateParcel = async (parcelData: any) => {
    try {
      const result = await createParcel(parcelData).unwrap();
      // You can access the trackingId and _id from the result
      console.log("Parcel created:", result.data._id, result.data.trackingId);
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
                {/* <CreateParcelForm onSubmit={handleCreateParcel} /> */}
                <CreateParcelForm 
        onSubmit={handleCreateParcel} 
        receiverOptions={receiverOptions} 
      />
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


// "use client"

// import { useEffect, useState } from "react"
// import { Package, Plus, Search, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { useGetMyParcelsQuery, useCreateParcelMutation, useGetAllUsersQuery, type User } from "@/store/api/parcelApi"
// import { useAppSelector } from "@/hooks/redux"
// import CreateParcelForm from "@/components/dashboard/CreateParcelForm"
// import ParcelTable from "@/components/dashboard/ParcelTable"
// import StatsCards from "@/components/dashboard/StatsCards"
// import Header from "@/components/Header"

// const SenderDashboard = () => {
//   const { user } = useAppSelector((state) => state.auth)
//   const { data: userParcels = [], isLoading } = useGetMyParcelsQuery()
//   const [createParcel] = useCreateParcelMutation()
//   const { data: allUsers } = useGetAllUsersQuery()

//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [receiverOptions, setReceiverOptions] = useState<Array<{ _id: string; name: string; email: string }>>([])
// console.log(userParcels, "user pricels");
//   // Filter users to get only receivers
//   useEffect(() => {
//     if (allUsers?.data) {
//       const receivers = allUsers.data.filter((user: User) => user.role === "receiver")
//       setReceiverOptions(receivers)
//     }
//   }, [allUsers])

//   const filteredParcels = userParcels?.data?.filter((parcel) => {
//     const matchesSearch =
//       parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       parcel.receiverId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       parcel.receiverId.email.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesStatus = statusFilter === "all" || parcel.status.toLowerCase() === statusFilter.toLowerCase()

//     return matchesSearch && matchesStatus
//   })

//   const stats = {
//     total: userParcels?.data?.length || 0,
//     pending: userParcels?.data?.filter((p) => p.status === "Requested").length || 0,
//     inTransit: userParcels?.data?.filter((p) => p.status === "In Transit").length || 0,
//     delivered: userParcels?.data?.filter((p) => p.status === "Delivered").length || 0,
//     cancelled: userParcels?.data?.filter((p) => p.status === "Cancelled").length || 0,
//   }

//   // const handleCreateParcel = async (parcelData: any) => {
//   //   try {
//   //     await createParcel(parcelData).unwrap();
//   //     setIsCreateDialogOpen(false);
//   //   } catch (error) {
//   //     console.error('Failed to create parcel:', error);
//   //   }
//   // };

//   const handleCreateParcel = async (parcelData: any) => {
//     try {
//       const result = await createParcel(parcelData).unwrap()
//       // You can access the trackingId and _id from the result
//       console.log("Parcel created:", result.data._id, result.data.trackingId)
//       setIsCreateDialogOpen(false)
//     } catch (error) {
//       console.error("Failed to create parcel:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Package className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
//           <p className="text-muted-foreground">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-muted/30">
//       <Header/>
//       {/* Header */}
//       <div className="bg-white shadow-card border-b">
//         <div className="container mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-primary">Sender Dashboard</h1>
//               <p className="text-muted-foreground mt-1">
//                 Welcome back, {user?.name}! Manage your parcels and shipments.
//               </p>
//             </div>
//             <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-gradient-primary hover:opacity-90 shadow-primary">
//                   <Plus className="w-5 h-5 mr-2" />
//                   Create Parcel
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle className="text-2xl text-primary">Create New Parcel</DialogTitle>
//                 </DialogHeader>
//                 {/* <CreateParcelForm onSubmit={handleCreateParcel} /> */}
//                 <CreateParcelForm onSubmit={handleCreateParcel} receiverOptions={receiverOptions} />
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-8">
//         {/* Stats Cards */}
//         <StatsCards stats={stats} />

//         {/* Filters and Search */}
//         <Card className="shadow-sm mb-8">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
//                   <Input
//                     placeholder="Search by tracking ID, receiver name, or email..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 h-12"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Requested">Requested</option>
//                   <option value="Approved">Approved</option>
//                   <option value="Dispatched">Dispatched</option>
//                   <option value="In Transit">In Transit</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//                 <Button variant="outline" size="icon">
//                   <Filter className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Parcels Table */}
//         <Card className="shadow-sm">
//           <CardHeader>
//             <CardTitle className="text-xl text-primary flex items-center">
//               <Package className="w-6 h-6 mr-2" />
//               My Parcels ({filteredParcels?.length || 0})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ParcelTable parcels={filteredParcels || []} userRole="sender" showActions={true} />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default SenderDashboard
