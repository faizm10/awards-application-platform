export interface Award {
  id: string;
  title: string;
  code: string;
  donor: string;
  value: string;
  deadline: string;
  citizenship: string[];
  description: string;
  eligibility: string;
  applicationMethod: string;
  category: string;
}

export const awards: Award[] = [
  {
    id: "1",
    title: "Janet Wardlaw Memorial Lang Scholarship",
    code: "I1168",
    donor: "Class of FACS 1974 & Class of Mac 1970",
    value: "1 award of $1,000",
    deadline: "May 15",
    citizenship: ["Canadian-PR-PP", "Non-Canadian-PR-PP"],
    description: "Established in memory of Janet Wardlaw, the first Dean of Family and Consumer Studies (FACS). Applications can be submitted to the committee with a one-page letter outlining community-based service or extracurricular involvement demonstrating leadership skills and volunteerism. In addition, indicate if experiential learning opportunities involved international travel. Selection will be based on highest cumulative average.",
    eligibility: "Students registered in any program offered by Gordon S. Lang School of Business and Economics with a minimum cumulative average of 75% who have completed or are currently enrolled in curriculum-embedded experiential learning who demonstrates significant volunteer contribution to community-based service or extracurricular involvement. Preference will be given to students participating in experiential learning opportunities involving international travel.",
    applicationMethod: "Apply by letter to lang.awards@uoguelph.ca",
    category: "Business & Economics"
  },
  {
    id: "2",
    title: "Bradley Traynor Memorial Scholarship",
    code: "I1289",
    donor: "Friends, Family, and Classmates of Bradley Traynor",
    value: "1 award of $1,000",
    deadline: "May 15",
    citizenship: ["Canadian-PR-PP", "Non-Canadian-PR-PP"],
    description: "Bradley Traynor tragically passed away at his home in Oshawa in 2020. His passing shook the campus community and everyone who knew him. To ensure Bradley's legacy lives on at the U of G, students, family, friends, faculty, and staff have established the Bradley Traynor Memorial Scholarship in his memory. Apply by May 15 to the Lang awards committee at lang.awards@uoguelph.ca with a letter that highlights leadership roles as evidenced by extracurricular activities, community involvement and/or employment.",
    eligibility: "Students registered in the B.Comm. program offered by the Gordon S. Lang School of Business and Economics who have completed a minimum of 2.5 credits and who have demonstrated leadership.",
    applicationMethod: "Apply by letter to lang.awards@uoguelph.ca",
    category: "Business & Economics"
  },
  {
    id: "3",
    title: "Excellence in Engineering Scholarship",
    code: "E2001",
    donor: "Engineering Alumni Association",
    value: "2 awards of $2,500",
    deadline: "March 31",
    citizenship: ["Canadian-PR-PP"],
    description: "This scholarship recognizes outstanding academic achievement and innovation in engineering studies. Recipients must demonstrate excellence in both theoretical knowledge and practical application through projects, co-op experiences, or research involvement.",
    eligibility: "Students enrolled in any Engineering program with a minimum cumulative average of 80% who have completed at least 5.0 credits. Must demonstrate innovation through projects, research, or co-op experiences.",
    applicationMethod: "Online application with portfolio submission",
    category: "Engineering"
  },
  {
    id: "4",
    title: "Future Leaders in Science Award",
    code: "S3045",
    donor: "Science Faculty Endowment Fund",
    value: "3 awards of $1,500",
    deadline: "April 1",
    citizenship: ["Canadian-PR-PP", "Non-Canadian-PR-PP"],
    description: "Supporting the next generation of scientific leaders through recognition of academic excellence and research potential. This award aims to encourage students to pursue advanced studies and research in their chosen scientific field.",
    eligibility: "Students in any Science program with a minimum cumulative average of 85% who have participated in undergraduate research or have demonstrated exceptional potential for scientific inquiry.",
    applicationMethod: "Apply online with research statement and faculty recommendation",
    category: "Science"
  }
];
