import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NAVBAR_LINKS } from "@/lib/constants";

export default function Home() {
  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatedGridPattern className="absolute inset-0" speed="slow" />
      </div>

      {/* Content */}
      <div className="relative z-10">

        

        {/* Hero Section */}
        <section className="container mx-auto py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-[#D8D8D8] px-4 py-1.5 text-sm">
                <span className="bg-[#FFC429] rounded-full w-2 h-2 mr-2"></span>
                <span>Fall 2025 Applications Open Now</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Fund Your <span className="text-[#E51937]">Future</span> with U
                of G Awards
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Discover and apply for scholarships, bursaries, and awards
                designed to recognize your achievements and support your
                educational journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={NAVBAR_LINKS.awards}>
                <Button className="bg-[#E51937] hover:bg-[#E51937]/90 text-white" >
                  Find Awards
                </Button>
                </a>
                {/* <Button variant="outline" className="border-[#D8D8D8]">
                  Check Eligibility
                </Button> */}
              </div>
              {/* <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Over $25 million in awards distributed annually
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#FFC429]" />
                    <span className="text-sm font-medium">
                      8,000+ students supported each year
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/hero.svg"
                alt="Student receiving award"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>


        {/* Featured Awards Section */}
        <section className="container mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Awards
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most prestigious and popular awards available to
              University of Guelph students.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "President's Scholarship",
                amount: "$42,000",
                description:
                  "Awarded to entering students with outstanding academic achievement and leadership.",
                deadline: "January 25, 2026",
                color: "#E51937",
              },
              {
                title: "Gryphon Athletic Scholarship",
                amount: "$20,000",
                description:
                  "For student-athletes who demonstrate exceptional athletic and academic abilities.",
                deadline: "March 1, 2026",
                color: "#FFC429",
              },
              {
                title: "Innovation Research Grant",
                amount: "$15,000",
                description:
                  "Supporting undergraduate research projects that demonstrate innovation and impact.",
                deadline: "November 15, 2025",
                color: "#187BB4",
              },
            ].map((award, index) => (
              <Card key={index} className="overflow-hidden">
                <div
                  className="h-2"
                  style={{ backgroundColor: award.color }}
                ></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{award.title}</CardTitle>
                    <Badge
                      style={{ backgroundColor: award.color }}
                      className="text-white"
                    >
                      {award.amount}
                    </Badge>
                  </div>
                  <CardDescription>{award.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>Application Deadline: {award.deadline}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: award.color }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-[#D8D8D8]">
              View All Awards
            </Button>
          </div>
        </section>

        {/* Application Process */}
        <section className="bg-[#F9F9F9] py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Application Process
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these simple steps to apply for awards and scholarships
                at the University of Guelph.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Search className="h-6 w-6" />,
                  title: "Find Awards",
                  description:
                    "Browse our comprehensive database to find awards that match your profile and interests.",
                  step: "1",
                },
                {
                  icon: <CheckCircle className="h-6 w-6" />,
                  title: "Check Eligibility",
                  description:
                    "Review the requirements to ensure you meet the criteria for the awards you're interested in.",
                  step: "2",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Prepare Materials",
                  description:
                    "Gather required documents, references, and write any necessary essays or statements.",
                  step: "3",
                },
                {
                  icon: <GraduationCap className="h-6 w-6" />,
                  title: "Submit Application",
                  description:
                    "Complete and submit your application through our online portal before the deadline.",
                  step: "4",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]/40 h-full">
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#E51937] text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-[#E51937]/10 flex items-center justify-center mb-4 text-[#E51937]">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-[#D8D8D8]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Upcoming Deadlines */}
        <section className="bg-[#000000] text-white py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Upcoming Deadlines
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Don&apos;t miss these important dates for award applications. Mark
                your calendar and apply early!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  date: "October 15, 2025",
                  awards: [
                    "Early Entrance Scholarships",
                    "Transfer Student Awards",
                  ],
                  color: "#E51937",
                },
                {
                  date: "January 25, 2026",
                  awards: [
                    "President's Scholarships",
                    "Chancellor's Scholarships",
                    "Lincoln Alexander Scholarships",
                  ],
                  color: "#FFC429",
                },
                {
                  date: "March 1, 2026",
                  awards: [
                    "Athletic Scholarships",
                    "Arts & Culture Awards",
                    "Community Impact Grants",
                  ],
                  color: "#187BB4",
                },
              ].map((deadline, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div
                    className="text-lg font-semibold mb-4 pb-2 border-b border-white/10"
                    style={{ color: deadline.color }}
                  >
                    {deadline.date}
                  </div>
                  <ul className="space-y-2">
                    {deadline.awards.map((award, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span>{award}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4"
                    style={{
                      backgroundColor: deadline.color,
                      color: deadline.color === "#FFC429" ? "black" : "white",
                    }}
                  >
                    Set Reminder
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#FFC429] py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  Ready to Apply?
                </h2>
                <p className="text-black/80">
                  Take the first step toward funding your education and
                  recognizing your achievements. Our team is here to help you
                  through the application process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#E51937] text-white hover:bg-[#E51937]/90">
                    Start Application
                  </Button>
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black/10"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-black" />
                  <h3 className="font-semibold text-black">
                    Financial Support
                  </h3>
                  <p className="text-sm text-black/70">
                    Reduce your educational costs
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-black" />
                  <h3 className="font-semibold text-black">Recognition</h3>
                  <p className="text-sm text-black/70">
                    Celebrate your achievements
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-black" />
                  <h3 className="font-semibold text-black">Community</h3>
                  <p className="text-sm text-black/70">
                    Join a network of scholars
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-black" />
                  <h3 className="font-semibold text-black">Opportunity</h3>
                  <p className="text-sm text-black/70">
                    Open doors to your future
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our awards and application
              process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "Who is eligible to apply for awards?",
                answer:
                  "Eligibility varies by award. Generally, you must be a current or incoming University of Guelph student. Some awards have specific criteria related to program, year of study, financial need, or other factors.",
              },
              {
                question: "When should I apply for awards?",
                answer:
                  "Application periods vary by award type. Entrance scholarships typically have January deadlines, while in-course awards may have fall or winter deadlines. Check specific award details for exact dates.",
              },
              {
                question: "How are award recipients selected?",
                answer:
                  "Selection processes vary by award. Some are based solely on academic achievement, while others consider financial need, leadership, community involvement, or other criteria specified in the award description.",
              },
              {
                question: "Can I receive multiple awards?",
                answer:
                  "Yes, in many cases you can receive multiple awards. However, some awards may have restrictions or may affect your overall financial aid package. Check with the Awards Office for specific details.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-[#D8D8D8]/40"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="border-[#D8D8D8]">
              View All FAQs
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#000000] text-white py-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-md bg-[#E51937] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <span className="font-semibold">University of Guelph</span>
                </div>
                <p className="text-sm text-gray-400">
                  Student Awards & Financial Aid
                  <br />
                  University Centre, Level 3
                  <br />
                  50 Stone Road East
                  <br />
                  Guelph, Ontario, N1G 2W1
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Award Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Application Portal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Eligibility Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Deadlines Calendar
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Financial Aid Office
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      OSAP Information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Budgeting Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Student Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>awards@uoguelph.ca</li>
                  <li>519-824-4120 ext. 58715</li>
                  <li>Monday-Friday: 8:30am-4:30pm</li>
                </ul>
                <div className="mt-4">
                  <Button className="bg-[#E51937] hover:bg-[#E51937]/90 w-full">
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2025 University of Guelph. All rights reserved.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accessibility
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Site Map
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
