import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Fetch all active awards to extract unique categories and citizenship options
    const { data: awards, error } = await supabase
      .from('awards')
      .select('category, citizenship')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching awards for filter options:', error);
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }

    // Extract unique categories
    const categories = [...new Set(awards?.map(award => award.category).filter(Boolean))];

    // Extract unique citizenship requirements
    const allCitizenships = awards?.flatMap(award => award.citizenship || []) || [];
    const citizenships = [...new Set(allCitizenships)].filter(Boolean);

    return NextResponse.json({
      categories,
      citizenships,
    });
  } catch (error) {
    console.error('Error in filter options API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 