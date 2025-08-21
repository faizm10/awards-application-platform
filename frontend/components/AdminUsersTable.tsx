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
import { User, Plus, Mail, Lock } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AdminUsersTable = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"admin" | "reviewer">("admin");

  // Create user modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    full_name: "",
    user_type: "reviewer" as "admin" | "reviewer",
    committee: "",
  });
  const [creating, setCreating] = useState(false);

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

  // Create user function
  const handleCreateUser = async () => {
    // Client-side validation
    if (!createForm.email || !createForm.password || !createForm.full_name) {
      toast("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      toast("Please enter a valid email address");
      return;
    }

    // Validate password strength
    if (createForm.password.length < 8) {
      toast("Password must be at least 8 characters long");
      return;
    }

    // Validate committee for reviewers
    if (createForm.user_type === "reviewer" && (!createForm.committee || createForm.committee.trim() === "")) {
      toast("Committee name is required for committee members");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: createForm.email,
          password: createForm.password,
          metadata: {
            full_name: createForm.full_name,
            user_type: createForm.user_type,
            committee: createForm.user_type === "reviewer" ? createForm.committee : null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // Add the new user to the local state using the API response
      setUsers((prev) => [data.user, ...prev]);
      
      // Reset form and close modal
      setCreateForm({
        email: "",
        password: "",
        full_name: "",
        user_type: "reviewer",
        committee: "",
      });
      setCreateModalOpen(false);
      
      toast.success(data.message || "User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(`Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateFormChange = (field: string, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUsers = users.filter((u) => u.user_type === activeRole);

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">
          {activeRole === "admin" ? "Admin Users" : "Committee Members"}
        </h3>
        <Button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create User
        </Button>
      </div>
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
                        <div className="flex gap-2 items-center">
                          <span>{user.committee || <span className="text-muted-foreground">(None)</span>}</span>
                          
                        </div>
                      
                    </TableCell>
                  )}
                  <TableCell className="capitalize">{user.user_type}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      
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

      {/* Create User Modal */}
      <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-8 shadow-lg focus:outline-none">
            <Dialog.Title className="text-xl font-bold mb-4">Create a new user</Dialog.Title>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email address
                </Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => handleCreateFormChange("email", e.target.value)}
                  placeholder="user@example.com"
                  disabled={creating}
                />
              </div>
              <div>
                <Label htmlFor="create-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  User Password
                </Label>
                <Input
                  id="create-password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => handleCreateFormChange("password", e.target.value)}
                  placeholder="Enter password (min 8 characters)"
                  disabled={creating}
                />
                {createForm.password && (
                  <div className="text-xs mt-1">
                    <span className={createForm.password.length >= 8 ? "text-green-600" : "text-red-600"}>
                      {createForm.password.length >= 8 ? "✓" : "✗"} Password strength: {createForm.password.length >= 8 ? "Good" : "Too short"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="create-full-name">Full Name</Label>
                <Input
                  id="create-full-name"
                  value={createForm.full_name}
                  onChange={(e) => handleCreateFormChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  disabled={creating}
                />
              </div>
              <div>
                <Label htmlFor="create-user-type">User Type</Label>
                <Select
                  value={createForm.user_type}
                  onValueChange={(value) => handleCreateFormChange("user_type", value as "admin" | "reviewer")}
                  disabled={creating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="reviewer">Committee Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {createForm.user_type === "reviewer" && (
                <div>
                  <Label htmlFor="create-committee">Committee *</Label>
                  <Input
                    id="create-committee"
                    value={createForm.committee}
                    onChange={(e) => handleCreateFormChange("committee", e.target.value)}
                    placeholder="Enter committee name"
                    disabled={creating}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Committee name is required for committee members
                  </div>
                </div>
              )}
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Users will be auto-confirmed and can log in immediately without email verification.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={creating} className="bg-green-600 hover:bg-green-700">
                {creating ? "Creating..." : "Create user"}
              </Button>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-900" aria-label="Close">
                <span aria-hidden>×</span>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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
