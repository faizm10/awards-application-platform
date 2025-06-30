import { createClient } from "@/lib/supabase/server"

export const resolvers = {
  Query: {
    profiles: async (_: any, { user_type }: { user_type?: string }) => {
      const supabase = await createClient()
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (user_type) {
        query = query.eq("user_type", user_type.toLowerCase())
      }

      const { data, error } = await query
      if (error) throw new Error(error.message)
      return data
    },

    profile: async (_: any, { id }: { id: string }) => {
      const supabase = await createClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

      if (error) throw new Error(error.message)
      return data
    },

    reviewers: async () => {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "reviewer")
        .order("created_at", { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },

    admins: async () => {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "admin")
        .order("created_at", { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
  },

  Mutation: {
    createProfile: async (_: any, { input }: { input: any }) => {
      const supabase = await createClient()

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          full_name: input.full_name,
          user_type: input.user_type.toLowerCase(),
        },
      })

      if (authError) throw new Error(authError.message)

      // Create user profile
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: input.email,
          full_name: input.full_name,
          user_type: input.user_type.toLowerCase(),
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },

    updateProfile: async (_: any, { input }: { input: any }) => {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("profiles")
        .update({
          email: input.email,
          full_name: input.full_name,
          user_type: input.user_type?.toLowerCase(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },

    deleteProfile: async (_: any, { id }: { id: string }) => {
      const supabase = await createClient()

      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id)
      if (authError) throw new Error(authError.message)

      // Delete from profiles table
      const { error } = await supabase.from("profiles").delete().eq("id", id)

      if (error) throw new Error(error.message)
      return true
    },
  },
}
