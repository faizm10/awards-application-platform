import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AwardsCard from "@/components/awards-card";
const AwardsPage = () => {
  return (
    <div>
      {/* Search Section */}
      <section className="container mx-auto py-10">
        <div className="bg-white rounded-xl shadow-lg border border-[#D8D8D8]/40 p-6">
          <h2 className="text-2xl font-bold mb-4">Find the Perfect Award</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search awards..."
                className="w-full pl-10 pr-4 py-2 border border-[#D8D8D8] rounded-md"
              />
            </div>
            <select className="border border-[#D8D8D8] rounded-md px-4 py-2">
              <option value="">Award Type</option>
              <option value="scholarship">Scholarships</option>
              <option value="bursary">Bursaries</option>
              <option value="grant">Grants</option>
            </select>
            <select className="border border-[#D8D8D8] rounded-md px-4 py-2">
              <option value="">Program/Faculty</option>
              <option value="arts">Arts</option>
              <option value="science">Science</option>
              <option value="business">Business</option>
              <option value="engineering">Engineering</option>
            </select>
            <Button className="bg-[#187BB4] hover:bg-[#187BB4]/90">
              Search Awards
            </Button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-3">
        <AwardsCard
          title="Agnes Yuen Leadership Scholarship"
          code="I4401"
          description="Students registered in a program offered by the Gordon S. Lang School of Business and Economics..."
          value="1 award of $2,400"
          awarded="In the winter and the recipient must be registered to receive"
          application={[
            "In-Course Financial Need Assessment Form",
            "Agnes Yuen Leadership Scholarship",
          ]}
          deadline="October 7"
          citizenship={["Canadian-PR-PP"]}
        />
      </section>
    </div>
  );
};

export default AwardsPage;
