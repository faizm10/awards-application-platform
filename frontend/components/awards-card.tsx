import { CalendarIcon, Award, DollarSign, Globe, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ScholarshipCardProps = {
  title: string;
  code: string;
  description: string;
  
  value?: string;
  awarded?: string;
  application?: string[];
  deadline?: string;
  citizenship?: string[];
};

export default function AwardsCard({
  title,
  code,
  description,
  
  value,
  awarded,
  application,
  deadline,
  citizenship,
}: ScholarshipCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#D8D8D8] shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-md">
      {/* Card Header */}
      <div className="border-b border-[#D8D8D8]">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#E51937] flex-1">
              {title}
            </h2>
            <Badge
              variant="outline"
              className="bg-[#F9F9F9] text-[#747676] font-mono"
            >
              {code}
            </Badge>
          </div>
          <p className="mt-3 text-gray-700 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6 bg-gradient-to-b from-white to-[#F9F9F9]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFC429]/10 flex items-center justify-center text-[#FFC429]">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Value</p>
                <p className="font-medium">{value}</p>
              </div>
            </div>
          )}

          {awarded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#187BB4]/10 flex items-center justify-center text-[#187BB4]">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Awarded</p>
                <p className="font-medium">{awarded}</p>
              </div>
            </div>
          )}

          {deadline && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E51937]/10 flex items-center justify-center text-[#E51937]">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Deadline</p>
                <p className="font-medium">{deadline}</p>
              </div>
            </div>
          )}

          {citizenship && citizenship.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#318738]/10 flex items-center justify-center text-[#318738]">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Citizenship</p>
                <p className="font-medium">{citizenship.join(", ")}</p>
              </div>
            </div>
          )}
        </div>

        {application && application.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#D8D8D8]">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-[#747676]" />
              <p className="font-medium">Application Requirements</p>
            </div>
            <ul className="space-y-1 pl-6">
              {application.map((item, idx) => (
                <li key={idx} className="text-gray-700 text-sm list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <Button
            asChild
            variant="outline"
            className="text-[#187BB4] border-[#187BB4] hover:bg-[#187BB4] hover:text-white transition-colors"
          >
            <a rel="noopener noreferrer">
              View Full Details
            </a>
          </Button>
          <span className="text-xs text-gray-500">Award Code: {code}</span>
        </div>
      </div>
    </div>
  );
}
