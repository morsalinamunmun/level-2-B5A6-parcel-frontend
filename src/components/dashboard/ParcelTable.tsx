import { useState } from "react";
import { Eye, MoreHorizontal, CheckCircle, XCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateParcelStatusMutation, useDeleteParcelMutation } from "@/store/api/parcelApi";
import { useToast } from "@/hooks/use-toast";
import type { Parcel } from "@/store/api/parcelApi";

interface ParcelTableProps {
  parcels: Parcel[];
  userRole: string;
  showActions: boolean;
}

const ParcelTable = ({ parcels, userRole, showActions }: ParcelTableProps) => {
  const { toast } = useToast();
  const [updateParcelStatus] = useUpdateParcelStatusMutation();
  const [deleteParcel] = useDeleteParcelMutation();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "text-warning";
      case 'in_transit':
        return "text-primary";
      case 'delivered':
        return "text-success";
      case 'cancelled':
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const handleStatusUpdate = async (parcelId: string, newStatus: string) => {
    try {
      await updateParcelStatus({
        id: parcelId,
        status: newStatus,
        note: `Status updated to ${newStatus} by ${userRole}`
      }).unwrap();
      
      toast({
        title: "Status Updated",
        description: `Parcel status has been updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update parcel status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (parcelId: string) => {
    try {
      await deleteParcel(parcelId).unwrap();
      toast({
        title: "Parcel Deleted",
        description: "The parcel has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete parcel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setIsDetailDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (parcels.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8" />
        </div>
        <p className="text-lg">No parcels found</p>
        <p className="text-sm">Start by creating your first parcel or adjust your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcels.map((parcel) => (
              <TableRow key={parcel._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <button
                    onClick={() => handleViewDetails(parcel)}
                    className="text-primary hover:underline"
                  >
                    {parcel.trackingId}
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{parcel.senderName}</p>
                    <p className="text-sm text-muted-foreground">{parcel.senderEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{parcel.receiverName}</p>
                    <p className="text-sm text-muted-foreground">{parcel.receiverEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{parcel.parcelType}</TableCell>
                <TableCell>{parcel.weight} kg</TableCell>
                <TableCell>${parcel.price}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(parcel.status)}
                    className={getStatusColor(parcel.status)}
                  >
                    {parcel.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(parcel.createdAt)}</TableCell>
                {showActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(parcel)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {userRole === 'admin' && (
                          <>
                            {parcel.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(parcel._id, 'in_transit')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Mark In Transit
                              </DropdownMenuItem>
                            )}
                            {parcel.status === 'in_transit' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(parcel._id, 'delivered')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Delivered
                              </DropdownMenuItem>
                            )}
                            {parcel.status !== 'delivered' && parcel.status !== 'cancelled' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(parcel._id, 'cancelled')}
                                className="text-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Parcel
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {userRole === 'sender' && parcel.status === 'pending' && (
                          <DropdownMenuItem 
                            onClick={() => handleDelete(parcel._id)}
                            className="text-destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Parcel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Parcel Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Parcel Details</DialogTitle>
          </DialogHeader>
          {selectedParcel && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Parcel Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tracking ID:</span> {selectedParcel.trackingId}</p>
                    <p><span className="font-medium">Type:</span> {selectedParcel.parcelType}</p>
                    <p><span className="font-medium">Weight:</span> {selectedParcel.weight} kg</p>
                    <p><span className="font-medium">Price:</span> ${selectedParcel.price}</p>
                    <p><span className="font-medium">Delivery Date:</span> {formatDate(selectedParcel.deliveryDate)}</p>
                    <p className="flex items-center space-x-2">
                      <span className="font-medium">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedParcel.status)}>
                        {selectedParcel.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Created:</span> {new Date(selectedParcel.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium">Updated:</span> {new Date(selectedParcel.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Sender & Receiver */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Sender Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedParcel.senderName}</p>
                    <p><span className="font-medium">Email:</span> {selectedParcel.senderEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedParcel.senderPhone}</p>
                    <p><span className="font-medium">Address:</span> {selectedParcel.senderAddress}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Receiver Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedParcel.receiverName}</p>
                    <p><span className="font-medium">Email:</span> {selectedParcel.receiverEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedParcel.receiverPhone}</p>
                    <p><span className="font-medium">Address:</span> {selectedParcel.receiverAddress}</p>
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedParcel.statusHistory && selectedParcel.statusHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Status History</h3>
                  <div className="space-y-3">
                    {selectedParcel.statusHistory.map((log, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{log.status.replace('_', ' ')}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-sm text-muted-foreground">{log.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated by: {log.updatedBy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParcelTable;