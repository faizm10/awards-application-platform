"use client";
import React from "react";
import { Filter, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReviewerActivityTabProps {
  reviews: any[];
  awards: any[];
  reviewerActivityFilter: string;
  onReviewerActivityFilterChange: (value: string) => void;
}

const ReviewerActivityTab: React.FC<ReviewerActivityTabProps> = ({
  reviews,
  awards,
  reviewerActivityFilter,
  onReviewerActivityFilterChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Reviewer Activity Header */}
      <div className="card-modern p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">
            Reviewer Activity
          </h3>
          <div className="flex items-center gap-4">
            <Select value={reviewerActivityFilter} onValueChange={onReviewerActivityFilterChange}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by award" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Awards</SelectItem>
                {awards.map((award) => (
                  <SelectItem key={award.id} value={award.id}>
                    {award.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviewer Activity Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Reviewer</TableHead>
                <TableHead className="font-semibold">Applicant</TableHead>
                <TableHead className="font-semibold">Award</TableHead>
                <TableHead className="font-semibold">Decision</TableHead>
                <TableHead className="font-semibold">Review Date</TableHead>
                <TableHead className="font-semibold">Comments</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews
                .filter((review) => 
                  reviewerActivityFilter === "all" || 
                  review.application?.award_id === reviewerActivityFilter
                )
                .map((review, index) => (
                  <TableRow 
                    key={review.id} 
                    className={`transition-all duration-200 hover:bg-muted/30 ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {review.reviewer?.full_name || 'Unknown Reviewer'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {review.reviewer?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {review.application?.first_name} {review.application?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.application?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {review.application?.award?.title || 'Unknown Award'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.application?.award?.code || 'No code'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`font-medium ${
                          review.shortlisted 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {review.shortlisted ? 'Approved' : 'Rejected'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {review.comments || 'No comments'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <button className="p-1 hover:bg-muted rounded">
                        <span className="text-xs text-muted-foreground">View</span>
                      </button>
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

export default ReviewerActivityTab;
