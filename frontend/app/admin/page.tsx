import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export default async function Admin() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch profile to check user_type
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile || profile.user_type !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all admin users
  const { data: adminUsers, error: adminUsersError } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("user_type", "admin");

  // Fetch all applications with student and award info
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select(
      `id, status, submitted_at, created_at, student:student_id (id, email, full_name), award:award_id (id, title, code, value)`
    )
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating Elements */}
      <div
        className="floating-element"
        style={{ top: "5%", right: "10%" }}
      ></div>
      <div
        className="floating-element"
        style={{ bottom: "20%", left: "5%" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {data.user.email?.split("@")[0]}! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                Admin Dashboard Overview
              </p>
            </div>
            {/* <div className="flex items-center gap-4">
              <Button asChild className="btn-primary">
                <Link href="/awards" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Awards
                </Link>
              </Button>
              <div className="hexagon neon-glow"></div>
            </div> */}
          </div>

          <div className="card-modern p-8 w-full mb-12">
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Manage awards, applications, and user profiles
            </p>
          </div>
        </div>

        {/* Admin Users Section */}
        <div className="card-modern p-8 w-full mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Admin Users</h2>
          {adminUsersError ? (
            <div className="text-red-600">
              Error loading admin users: {adminUsersError.message}
            </div>
          ) : !adminUsers ? (
            <div className="text-muted-foreground">Loading admin users...</div>
          ) : adminUsers.length === 0 ? (
            <div className="text-muted-foreground">No admin users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Full Name</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user: any) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        {user.full_name || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div className="card-modern p-8 w-full">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            All Applications
          </h2>
          {applicationsError ? (
            <div className="text-red-600">
              Error loading applications: {applicationsError.message}
            </div>
          ) : !applications ? (
            <div className="text-muted-foreground">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-muted-foreground">No applications found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full text-sm border rounded-lg">
                <TableHead>
                  <TableRow className="bg-muted">
                    <TableHead className="px-4 py-2 text-left">Award</TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Student
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Submitted At
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app: any) => (
                    <TableRow key={app.id} className="border-b last:border-0">
                      <TableCell className="px-4 py-2">
                        {app.award?.title ? (
                          <span className="font-medium text-foreground">
                            {app.award.title}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {app.award?.code}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {app.student?.full_name || app.student?.email || (
                          <span className="text-muted-foreground">-</span>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {app.student?.email}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2 capitalize">
                        {app.status}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {app.submitted_at ? (
                          new Date(app.submitted_at).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
