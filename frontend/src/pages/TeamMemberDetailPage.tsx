import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { LinkedinIcon, WhatsappIcon } from "@/components/common/SocialIcon";
import { QueryState } from "@/components/common/QueryState";
import { ApiError } from "@/lib/api/client";
import { useTeamMemberDetailQuery } from "@/lib/api/team";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function TeamMemberDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: member, isLoading, isError, error, refetch } = useTeamMemberDetailQuery(slug ?? "");

  useDocumentTitle(member?.name ?? "Team");

  if (error instanceof ApiError && error.status === 404) {
    return <Navigate to="/services#team" replace />;
  }

  return (
    <div className="bg-surface-secondary">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
        <Link
          to="/services#team"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
        >
          <ArrowLeft size={16} /> Back to Team
        </Link>

        <div className="mt-8">
          <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
            {member && (
              <>
                <img src={member.photo} alt={member.name} className="mx-auto h-32 w-32 rounded-full object-cover" />
                <h1 className="mt-4 font-display text-2xl font-bold text-text-primary">{member.name}</h1>
                <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>

                <div className="mt-5 flex items-center justify-center gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      aria-label="Email"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary hover:border-primary"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      aria-label="Phone"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary hover:border-primary"
                    >
                      <Phone size={18} />
                    </a>
                  )}
                  {member.whatsapp && (
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary hover:border-primary"
                    >
                      <WhatsappIcon size={18} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary hover:border-primary"
                    >
                      <LinkedinIcon size={18} />
                    </a>
                  )}
                </div>

                <p className="mt-8 text-text-secondary">{member.bio}</p>
              </>
            )}
          </QueryState>
        </div>
      </div>
    </div>
  );
}
