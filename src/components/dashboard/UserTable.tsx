
import { MoreHorizontal, Shield, ShieldOff, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useBlockUserMutation, useUnblockUserMutation, type User } from "@/store/api/parcelApi"

interface UserTableProps {
  users: User[]
}

const UserTable = ({ users }: UserTableProps) => {
  const { toast } = useToast()
  const [blockUser] = useBlockUserMutation()
  const [unblockUser] = useUnblockUserMutation()

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "default"
      case "sender":
        return "secondary"
      case "receiver":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "active" ? "default" : "destructive"
  }

  const handleStatusToggle = async (user: User) => {
    try {
      if (user.isActive === "ACTIVE") {
        await blockUser(user._id).unwrap()
        toast({
          title: "User Blocked",
          description: `${user.name} has been blocked.`,
        })
      } else {
        await unblockUser(user._id).unwrap()
        toast({
          title: "User Activated",
          description: `${user.name} has been activated.`,
        })
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <p className="text-lg">No users found</p>
        <p className="text-sm">No users match your current filters.</p>
      </div>
    )
  }

  console.log(users, "users")

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user._id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user?.role)}>{user?.role?.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(user.isActive)}>{user?.isActive?.toUpperCase()}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(user?.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user?.isActive === "ACTIVE" ? (
                      <DropdownMenuItem onClick={() => handleStatusToggle(user)} className="text-destructive">
                        <ShieldOff className="w-4 h-4 mr-2" />
                        Block User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusToggle(user)} className="text-success">
                        <Shield className="w-4 h-4 mr-2" />
                        Activate User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserTable
