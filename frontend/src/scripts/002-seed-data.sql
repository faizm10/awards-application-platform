-- Insert sample awards
INSERT INTO public.awards (title, code, donor, value, deadline, citizenship, description, eligibility, application_method, category) VALUES
(
  'Janet Wardlaw Memorial Lang Scholarship',
  'I1168',
  'Class of FACS 1974 & Class of Mac 1970',
  '1 award of $1,000',
  '2024-05-15',
  ARRAY['Canadian-PR-PP', 'Non-Canadian-PR-PP'],
  'Established in memory of Janet Wardlaw, the first Dean of Family and Consumer Studies (FACS). Applications can be submitted to the committee with a one-page letter outlining community-based service or extracurricular involvement demonstrating leadership skills and volunteerism. In addition, indicate if experiential learning opportunities involved international travel. Selection will be based on highest cumulative average.',
  'Students registered in any program offered by Gordon S. Lang School of Business and Economics with a minimum cumulative average of 75% who have completed or are currently enrolled in curriculum-embedded experiential learning who demonstrates significant volunteer contribution to community-based service or extracurricular involvement. Preference will be given to students participating in experiential learning opportunities involving international travel.',
  'Apply by letter to lang.awards@uoguelph.ca',
  'Business & Economics'
),
(
  'Bradley Traynor Memorial Scholarship',
  'I1289',
  'Friends, Family, and Classmates of Bradley Traynor',
  '1 award of $1,000',
  '2024-05-15',
  ARRAY['Canadian-PR-PP', 'Non-Canadian-PR-PP'],
  'Bradley Traynor tragically passed away at his home in Oshawa in 2020. His passing shook the campus community and everyone who knew him. To ensure Bradley''s legacy lives on at the U of G, students, family, friends, faculty, and staff have established the Bradley Traynor Memorial Scholarship in his memory.',
  'Students registered in the B.Comm. program offered by the Gordon S. Lang School of Business and Economics who have completed a minimum of 2.5 credits and who have demonstrated leadership.',
  'Apply by letter to lang.awards@uoguelph.ca',
  'Business & Economics'
),
(
  'Excellence in Engineering Scholarship',
  'E2001',
  'Engineering Alumni Association',
  '2 awards of $2,500',
  '2024-03-31',
  ARRAY['Canadian-PR-PP'],
  'This scholarship recognizes outstanding academic achievement and innovation in engineering studies. Recipients must demonstrate excellence in both theoretical knowledge and practical application through projects, co-op experiences, or research involvement.',
  'Students enrolled in any Engineering program with a minimum cumulative average of 80% who have completed at least 5.0 credits. Must demonstrate innovation through projects, research, or co-op experiences.',
  'Online application with portfolio submission',
  'Engineering'
);

-- Insert sample applications (you'll need actual user IDs from auth.users)
-- This is just for structure - real data would come from actual user registrations
