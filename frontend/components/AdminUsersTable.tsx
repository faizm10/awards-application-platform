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
import { Button } from "@/components/ui/button"; // Added Button import
import { Tabs } from "@/components/ui/tabs"; // Added Tabs and Tab imports
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

const AdminUsersTable = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"admin" | "reviewer">("admin");

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
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, user_type: newRole } : user
        )
      );
      toast("Role updated successfully");
    }
    setUpdatingId(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, user_type, created_at, updated_at, committee")
        .in("user_type", ["admin", "reviewer"])
        .order("created_at", { ascending: false });
      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Committee editing state
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);
  const [committeeInput, setCommitteeInput] = useState<string>("");

  const handleCommitteeSave = async (id: string) => {
    setUpdatingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ committee: committeeInput })
      .eq("id", id);
    if (error) {
      toast("Failed to update committee");
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, committee: committeeInput } : user
        )
      );
      toast("Committee updated successfully");
      setEditingCommitteeId(null);
    }
    setUpdatingId(null);
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<Profile | null>(null);
  const [modalForm, setModalForm] = useState({ full_name: "", email: "", user_type: "reviewer", committee: "" });
  const [removing, setRemoving] = useState(false);

  const openEditModal = (user: Profile) => {
    setModalUser(user);
    setModalForm({
      full_name: user.full_name || "",
      email: user.email,
      user_type: user.user_type,
      committee: user.committee || "",
    });
    setModalOpen(true);
  };

  const handleModalChange = (field: string, value: string) => {
    setModalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSave = async () => {
    if (!modalUser) return;
    setUpdatingId(modalUser.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: modalForm.full_name,
        email: modalForm.email,
        user_type: modalForm.user_type,
        committee: modalForm.user_type === "reviewer" ? modalForm.committee : null,
      })
      .eq("id", modalUser.id);
    if (error) {
      toast("Failed to update user");
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === modalUser.id
            ? {
                ...user,
                full_name: modalForm.full_name,
                email: modalForm.email,
                user_type: modalForm.user_type,
                committee: modalForm.user_type === "reviewer" ? modalForm.committee : undefined,
              }
            : user
        )
      );
      toast("User updated successfully");
      setModalOpen(false);
    }
    setUpdatingId(null);
  };

  const handleRemoveUser = async () => {
    if (!modalUser) return;
    setRemoving(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").delete().eq("id", modalUser.id);
    if (error) {
      toast("Failed to remove user");
    } else {
      setUsers((prev) => prev.filter((user) => user.id !== modalUser.id));
      toast("User removed successfully");
      setModalOpen(false);
    }
    setRemoving(false);
  };

  const filteredUsers = users.filter((u) => u.user_type === activeRole);

  return (
    <div className="card-modern p-6">
      <h3 className="text-xl font-bold mb-4 text-foreground">
        {activeRole === "admin" ? "Admin Users" : "Committee Members"}
      </h3>
      <div className="mb-4 flex gap-2">
        <Button
          variant={activeRole === "admin" ? "default" : "outline"}
          onClick={() => setActiveRole("admin")}
        >
          Admins
        </Button>
        <Button
          variant={activeRole === "reviewer" ? "default" : "outline"}
          onClick={() => setActiveRole("reviewer")}
        >
          Committee Members
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {activeRole === "reviewer" && <TableHead>Committee</TableHead>}
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={activeRole === "reviewer" ? 6 : 5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={activeRole === "reviewer" ? 6 : 5} className="text-center py-8">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{user.full_name || "(No Name)"}</span>
                  </TableCell>
                  {activeRole === "reviewer" && (
                    <TableCell>
                      {editingCommitteeId === user.id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={committeeInput}
                            onChange={(e) => setCommitteeInput(e.target.value)}
                            disabled={updatingId === user.id}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleCommitteeSave(user.id)}
                            disabled={updatingId === user.id || !committeeInput.trim()}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCommitteeId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <span>{user.committee || <span className="text-muted-foreground">(None)</span>}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCommitteeId(user.id);
                              setCommitteeInput(user.committee || "");
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="capitalize">{user.user_type}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.user_type}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                        disabled={updatingId === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Edit Modal */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-8 shadow-lg focus:outline-none">
            <Dialog.Title className="text-xl font-bold mb-4">Edit User</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={modalForm.full_name}
                  onChange={(e) => handleModalChange("full_name", e.target.value)}
                  disabled={updatingId === modalUser?.id}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  value={modalForm.email}
                  onChange={(e) => handleModalChange("email", e.target.value)}
                  disabled={updatingId === modalUser?.id}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select
                  value={modalForm.user_type}
                  onValueChange={(value) => handleModalChange("user_type", value)}
                  disabled={updatingId === modalUser?.id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {modalForm.user_type === "reviewer" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Committee</label>
                  <Input
                    value={modalForm.committee}
                    onChange={(e) => handleModalChange("committee", e.target.value)}
                    disabled={updatingId === modalUser?.id}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <Button
                variant="destructive"
                onClick={handleRemoveUser}
                disabled={removing}
              >
                {removing ? "Removing..." : "Remove User"}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleModalSave} disabled={updatingId === modalUser?.id}>
                  Save Changes
                </Button>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-900" aria-label="Close">
                <span aria-hidden>×</span>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminUsersTable;
