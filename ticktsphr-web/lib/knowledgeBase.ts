import { supabase } from "./supabase";

export async function getKnowledgeArticles(
  search?: string,
  organizationId?: string
) {
  let query = supabase
    .from("knowledge_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  if (search && search.trim() !== "") {
    query = query.or(
      `title.ilike.%${search}%,problem_summary.ilike.%${search}%,resolution.ilike.%${search}%,root_cause.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Knowledge Base fetch error:", error.message);
    return [];
  }

  return data || [];
}

export async function getKnowledgeAnalytics(organizationId?: string) {
  let query = supabase
    .from("knowledge_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Knowledge analytics error:", error.message);
    return [];
  }

  return data || [];
}

export async function getKnowledgeArticleById(id: string) {
  const cleanId = String(id).trim();

  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("id", cleanId)
    .maybeSingle();

  if (error) {
    console.error("Knowledge article fetch error:", error.message);
    return null;
  }

  return data;
}

export async function saveResolutionToKnowledgeBase(
  ticket: any,
  organizationId?: string
) {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .insert([
      {
        title: ticket.title || `Resolution for Ticket #${ticket.id}`,
        problem_summary:
          ticket.description || ticket.problem_summary || "No summary available",
        resolution:
          ticket.ai_resolution ||
          ticket.resolution ||
          "Resolution not available",
        root_cause:
          ticket.root_cause ||
          ticket.probable_root_cause ||
          "Root cause not available",
        category: ticket.category || "General",
        source_ticket_id: ticket.id,
        usage_count: 0,
        organization_id: organizationId || ticket.organization_id || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Save knowledge error:", error.message);
    return null;
  }

  return data;
}

export async function searchSimilarKnowledgeArticles(
  searchText: string,
  organizationId?: string
) {
  if (!searchText || searchText.trim() === "") {
    return [];
  }

  let query = supabase
    .from("knowledge_articles")
    .select("*")
    .or(
      `title.ilike.%${searchText}%,problem_summary.ilike.%${searchText}%,resolution.ilike.%${searchText}%,root_cause.ilike.%${searchText}%`
    )
    .limit(5);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Semantic search error:", error.message);
    return [];
  }

  return (data || []).map((article: any) => ({
    ...article,
    match_score: article.match_score || 80,
  }));
}

export async function incrementKnowledgeUsage(id: string) {
  const article = await getKnowledgeArticleById(id);

  if (!article) return null;

  const newCount = (article.usage_count || 0) + 1;

  const { data, error } = await supabase
    .from("knowledge_articles")
    .update({ usage_count: newCount })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Knowledge usage increment error:", error.message);
    return null;
  }

  return data;
}

export async function getMostReusedResolutions(organizationId?: string) {
  let query = supabase
    .from("knowledge_articles")
    .select("*")
    .gt("usage_count", 0)
    .order("usage_count", { ascending: false })
    .limit(5);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Leaderboard fetch error:", error.message);
    return [];
  }

  return data || [];
}

export async function getKnowledgeReuseKPI(organizationId?: string) {
  let query = supabase.from("knowledge_articles").select("usage_count");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Knowledge KPI error:", error.message);
    return {
      totalReuse: 0,
      reusedArticles: 0,
    };
  }

  const totalReuse = (data || []).reduce(
    (sum: number, article: any) => sum + (article.usage_count || 0),
    0
  );

  const reusedArticles = (data || []).filter(
    (article: any) => (article.usage_count || 0) > 0
  ).length;

  return {
    totalReuse,
    reusedArticles,
  };
}

export async function getMTTRReductionMetrics(organizationId?: string) {
  let query = supabase.from("knowledge_articles").select("usage_count");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("MTTR metrics error:", error.message);

    return {
      totalReuse: 0,
      estimatedHoursSaved: 0,
      estimatedMinutesSaved: 0,
      reuseRateLabel: "0%",
    };
  }

  const totalReuse = (data || []).reduce(
    (sum: number, article: any) => sum + (article.usage_count || 0),
    0
  );

  const estimatedMinutesSaved = totalReuse * 45;
  const estimatedHoursSaved = Number((estimatedMinutesSaved / 60).toFixed(1));

  return {
    totalReuse,
    estimatedMinutesSaved,
    estimatedHoursSaved,
    reuseRateLabel: totalReuse > 0 ? "Active" : "0%",
  };
}

export async function getCostSavingsMetrics(organizationId?: string) {
  let query = supabase.from("knowledge_articles").select("usage_count");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Cost savings metrics error:", error.message);

    return {
      totalReuse: 0,
      hoursSaved: 0,
      analystCostPerHour: 2500,
      monthlySavings: 0,
      annualSavings: 0,
      roiPercent: 0,
    };
  }

  const totalReuse = (data || []).reduce(
    (sum: number, article: any) => sum + (article.usage_count || 0),
    0
  );

  const minutesSaved = totalReuse * 45;
  const hoursSaved = Number((minutesSaved / 60).toFixed(1));

  const analystCostPerHour = 2500;
  const monthlySavings = Math.round(hoursSaved * analystCostPerHour);
  const annualSavings = monthlySavings * 12;

  const assumedMonthlyPlatformCost = 50000;
  const roiPercent =
    assumedMonthlyPlatformCost > 0
      ? Math.round((monthlySavings / assumedMonthlyPlatformCost) * 100)
      : 0;

  return {
    totalReuse,
    hoursSaved,
    analystCostPerHour,
    monthlySavings,
    annualSavings,
    roiPercent,
  };
}