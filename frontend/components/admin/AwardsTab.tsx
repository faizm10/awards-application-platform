"use client";
import React from "react";
import { Search, Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AwardsTabProps {
  awards: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEditAward: (award: any) => void;
  onCreateAward: () => void;
}

const AwardsTab: React.FC<AwardsTabProps> = ({
  awards,
  searchTerm,
  onSearchChange,
  onEditAward,
  onCreateAward,
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="card-modern p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search awards..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            onClick={onCreateAward}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Create New Award
          </Button>
        </div>
      </div>

      {/* Awards Table */}
      <div className="card-modern p-6">
        <h3 className="text-xl font-bold mb-4 text-foreground">
          Awards List
        </h3>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 px-4 font-medium">
                  Title
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  Value
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  Category
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  Deadline
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards
                .filter((award: any) => {
                  if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    const matchesSearch = 
                      award.title?.toLowerCase().includes(searchLower) ||
                      award.code?.toLowerCase().includes(searchLower) ||
                      award.category?.toLowerCase().includes(searchLower) ||
                      award.donor?.toLowerCase().includes(searchLower);
                    if (!matchesSearch) {
                      return false;
                    }
                  }
                  return true;
                })
                .map((award: any) => (
                  <TableRow
                    key={award.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="py-3 px-4">
                      <div>
                        <div className="font-medium">{award.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {award.code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div>
                        <div className="font-medium">{award.value}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {award.category}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {award.deadline
                        ? award.deadline
                        : "-"}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditAward(award)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AwardsTab;
