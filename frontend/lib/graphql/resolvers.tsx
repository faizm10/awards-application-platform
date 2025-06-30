import { createClient } from "../supabase/client"
const supabase = createClient();
export const resolvers = {
  Query: {
    awards: async (_: any, { filter }: { filter?: any }) => {
      let query = supabase.from("awards").select("*")

      if (filter?.is_active !== undefined) {
        query = query.eq("is_active", filter.is_active)
      }

      if (filter?.category && filter.category !== "All Categories") {
        query = query.eq("category", filter.category)
      }

      if (filter?.search) {
        query = query.or(
          `title.ilike.%${filter.search}%,donor.ilike.%${filter.search}%,description.ilike.%${filter.search}%`,
        )
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw new Error(error.message)
      return data || []
    },

    award: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabase.from("awards").select("*").eq("id", id).single()

      if (error) throw new Error(error.message)
      return data
    },

    featuredAwards: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw new Error(error.message)

      // Filter for high-value awards as featured
      return (data || []).filter((award: any) => {
        const value = Number.parseInt(award.value.replace(/[^0-9]/g, ""))
        return value >= 10000
      })
    },
  },

  Mutation: {
    createAward: async (_: any, { input }: { input: any }) => {
      const { data, error } = await supabase.from("awards").insert([input]).select().single()

      if (error) throw new Error(error.message)
      return data
    },

    updateAward: async (_: any, { id, input }: { id: string; input: any }) => {
      const { data, error } = await supabase
        .from("awards")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },

    deleteAward: async (_: any, { id }: { id: string }) => {
      const { error } = await supabase.from("awards").delete().eq("id", id)

      if (error) throw new Error(error.message)
      return true
    },
  },
}
