"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Profile } from "@/types/awards";
import { User } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminUsersTable = () => {
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ user_type: newRole })
      .eq("id", id);
    if (error) {
      toast("Failed to update role");
    } else {
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === id ? { ...admin, user_type: newRole } : admin
        )
      );
      toast("Role updated successfully");
    }
    setUpdatingId(null);
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, user_type, created_at, updated_at")
        .eq("user_type", "admin")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setAdmins(data);
      }
      setLoading(false);
    };
    fetchAdmins();
  }, []);

  return (
    <div className="card-modern p-6">
      <h3 className="text-xl font-bold mb-4 text-foreground">Admin Users</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No admin users found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{admin.full_name || "(No Name)"}</span>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* <Button size="sm" variant="outline">
                        Edit
                      </Button> */}
                      <Select
                        value={admin.user_type}
                        onValueChange={(value) =>
                          handleRoleChange(admin.id, value)
                        }
                        disabled={updatingId === admin.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                          {/* <SelectItem value="student">Student</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersTable;
