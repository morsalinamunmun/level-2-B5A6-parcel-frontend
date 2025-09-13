
import { useState } from "react"
import { Package, Search, Filter, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetIncomingParcelsQuery, useConfirmDeliveryMutation } from "@/store/api/parcelApi"
import { useAppSelector } from "@/hooks/redux"
import { useToast } from "@/hooks/use-toast"
import ParcelTable from "@/components/dashboard/ParcelTable"
import StatsCards from "@/components/dashboard/StatsCards"
import Header from "@/components/Header"

const ReceiverDashboard = () => {
  const { toast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { data: userParcels, isLoading } = useGetIncomingParcelsQuery()
  const [confirmDelivery] = useConfirmDeliveryMutation()
  console.log(userParcels, "userParcels")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredParcels = userParcels?.data?.filter((parcel) => {
    const matchesSearch =
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderId.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || parcel.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: userParcels?.data?.length || 0,
    pending: userParcels?.data?.filter((p) => p.status === "Requested").length || 0,
    inTransit: userParcels?.data?.filter((p) => p.status === "In Transit").length || 0,
    delivered: userParcels?.data?.filter((p) => p.status === "Delivered").length || 0,
    cancelled: userParcels?.data?.filter((p) => p.status === "Cancelled").length || 0,
  }

  const handleConfirmDelivery = async (parcelId: string) => {
    try {
      await confirmDelivery(parcelId).unwrap()

      toast({
        title: "Delivery Confirmed",
        description: "The parcel has been marked as delivered successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm delivery. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header/>
      {/* Header */}
      <div className="bg-white shadow-card border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Receiver Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}! Track and manage your incoming parcels.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Pending Deliveries</div>
              <div className="text-2xl font-bold text-primary">{stats.inTransit}</div>
            </div>
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
                    placeholder="Search by tracking ID, sender name, or email..."
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

        {/* Incoming Parcels */}
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Parcels Awaiting Confirmation ({userParcels?.data?.filter((p) => p.status === "In Transit").length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userParcels?.data?.filter((p) => p.status === "In Transit").length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No parcels waiting for confirmation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userParcels?.data
                  ?.filter((p) => p.status === "In Transit")
                  .map((parcel) => (
                    <div key={parcel._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold text-foreground">Tracking ID: {parcel.trackingId}</p>
                            <p className="text-sm text-muted-foreground">
                              From: {parcel.senderId.name} ({parcel.senderId.email})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Type: {parcel.type} • Weight: {parcel.weight}kg
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleConfirmDelivery(parcel._id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Delivery
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Parcels Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <Package className="w-6 h-6 mr-2" />
              All My Parcels ({filteredParcels?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ParcelTable parcels={filteredParcels || []} userRole="receiver" showActions={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReceiverDashboard
