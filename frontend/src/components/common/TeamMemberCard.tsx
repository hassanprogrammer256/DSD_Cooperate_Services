import { Link } from "react-router-dom";

import type { TeamMember } from "@/types";

type Props = {
  member: TeamMember;
};

export function TeamMemberCard({ member }: Props) {
  return (
    <Link
      to={`/team/${member.slug}`}
      className="w-64 shrink-0 snap-start rounded-xl border border-border bg-surface p-5 text-center hover:border-primary md:w-72"
    >
      <img src={member.photo} alt={member.name} className="mx-auto h-20 w-20 rounded-full object-cover" />
      <p className="mt-4 font-display text-base font-semibold text-text-primary">{member.name}</p>
      <p className="text-sm font-medium text-primary">{member.role}</p>
      <p className="mt-2 line-clamp-3 text-sm text-text-secondary">{member.bio}</p>
    </Link>
  );
}
