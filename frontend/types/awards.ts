
export type Award = {
    id: string
    title: string
    code: string
    donor: string
    value: string
    deadline: string
    citizenship: string[]
    description: string
    eligibility: string
    application_method: string
    category: string
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: string | null
  }

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  user_type: string;
  created_at: string;
  updated_at: string;
  committee?: string;
};
  