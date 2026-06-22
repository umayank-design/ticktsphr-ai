"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Comment = {
  id: string;
  comment: string;
  commented_by: string | null;
  is_internal: boolean;
  created_at: string;
};

export default function TicketComments({
  ticketId,
  organizationId,
}: {
  ticketId: string;
  organizationId: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  async function loadComments() {
    const { data, error } = await supabase
      .from("ticket_comments")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Comments fetch error:", error.message);
      return;
    }

    setComments(data || []);
  }

  async function addComment() {
    if (!comment.trim()) return;

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("ticket_comments").insert({
      ticket_id: ticketId,
      organization_id: organizationId,
      comment,
      commented_by: userData.user?.email || "User",
      is_internal: isInternal,
    });

    if (error) {
      console.error("Comment insert error:", error.message);
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("ticket_events").insert({
      ticket_id: ticketId,
      organization_id: organizationId,
      event_type: "Comment Added",
      new_value: isInternal ? "Internal comment added" : "Public comment added",
      created_by: userData.user?.email || "User",
    });

    setComment("");
    setIsInternal(false);
    setLoading(false);
    loadComments();
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Comments</h2>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full min-h-[100px] bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
      />

      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
          />
          Internal note
        </label>

        <button
          onClick={addComment}
          disabled={loading}
          className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Comment"}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {comments.length === 0 && (
          <p className="text-slate-400 text-sm">No comments yet.</p>
        )}

        {comments.map((c) => (
          <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-cyan-400">
                {c.commented_by || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>

            {c.is_internal && (
              <span className="inline-block mb-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                Internal
              </span>
            )}

            <p className="text-slate-200 whitespace-pre-wrap">{c.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}