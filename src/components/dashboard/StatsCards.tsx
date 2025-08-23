import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cardData = [
    {
      title: "Total Parcels",
      value: stats.total,
      icon: Package,
      gradient: "bg-gradient-primary",
      textColor: "text-primary"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      gradient: "bg-warning",
      textColor: "text-warning"
    },
    {
      title: "In Transit",
      value: stats.inTransit,
      icon: Truck,
      gradient: "bg-gradient-secondary",
      textColor: "text-secondary-accent"
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      gradient: "bg-success",
      textColor: "text-success"
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      gradient: "bg-destructive",
      textColor: "text-destructive"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {cardData.map((card, index) => (
        <Card key={index} className="card-gradient shadow-card hover:shadow-elevated transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${card.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;