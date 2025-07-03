import { Award, CheckCircle, Clock, DollarSign } from "lucide-react";

 // Mock data for awards
export const mockAwards = [
    {
      id: 1,
      title: "Merit Scholarship",
      amount: "$10,000",
      deadline: "2024-03-15",
      status: "applied",
      category: "Academic Excellence",
      progress: 100,
    },
    {
      id: 2,
      title: "Research Grant",
      amount: "$5,000",
      deadline: "2024-04-01",
      status: "pending",
      category: "Research",
      progress: 75,
    },
    {
      id: 3,
      title: "Leadership Award",
      amount: "$2,500",
      deadline: "2024-03-30",
      status: "won",
      category: "Leadership",
      progress: 100,
    },
  ];

export  const stats = [
    {
      icon: Award,
      label: "Total Awards",
      value: "15",
      color: "from-primary to-chart-2",
      change: "+3",
    },
    {
      icon: CheckCircle,
      label: "Applied",
      value: "8",
      color: "from-chart-2 to-chart-3",
      change: "+2",
    },
    {
      icon: Clock,
      label: "Pending",
      value: "5",
      color: "from-chart-3 to-chart-4",
      change: "+1",
    },
    {
      icon: DollarSign,
      label: "Total Value",
      value: "$45K",
      color: "from-chart-4 to-chart-5",
      change: "+$12K",
    },
  ];

  export const upcomingDeadlines = [
    { title: "Merit Scholarship", date: "Mar 15", days: 5 },
    { title: "Research Grant", date: "Apr 1", days: 22 },
    { title: "Leadership Award", date: "Mar 30", days: 20 },
  ];