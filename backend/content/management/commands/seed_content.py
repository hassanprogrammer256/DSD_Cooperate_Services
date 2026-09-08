import json
import re
from base64 import b64decode
from pathlib import Path
from urllib.parse import unquote

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from content.models import ComplianceArea, Founder, InsightArticle, PricingTier, Service, Stat, Testimonial, TeamMember

FIXTURE_PATH = Path(settings.BASE_DIR) / "content" / "fixtures" / "seed_data.json"

# Matches "AED 4,500" -> amount 4500.00. A tier whose price has no leading number
# (e.g. "Custom") gets amount=None — see content/models.py's PricingTier docstring for
# why that's correct, not a gap: it means that tier isn't purchasable through checkout.
PRICE_PATTERN = re.compile(r"([A-Z]{3})\s*([\d,]+)")


def decode_data_uri_to_file(data_uri: str, filename: str) -> ContentFile:
    """The exported seed JSON stores images as data: URIs (Vite inlines small SVG
    assets that way) — decode straight from that instead of needing the original file
    on disk. Handles both `;base64,` and plain URL-encoded SVG data URIs."""
    header, payload = data_uri.split(",", 1)
    if "base64" in header:
        content = b64decode(payload)
    else:
        content = unquote(payload).encode("utf-8")
    return ContentFile(content, name=filename)


class Command(BaseCommand):
    help = "Seeds the database from the pre-pivot src/data/*.ts content (via scripts/export-seed-data.mjs's JSON dump). Safe to re-run — every row is keyed by its slug/key, so this updates existing rows rather than duplicating them."

    def handle(self, *args, **options):
        if not FIXTURE_PATH.exists():
            self.stderr.write(
                f"{FIXTURE_PATH} not found — run `node scripts/export-seed-data.mjs` "
                "from the repo root first."
            )
            return

        data = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))

        team_by_slug = self._seed_team(data["team"])
        self._seed_founder(data["founder"])
        insights_by_slug = self._seed_insights(data["insights"])
        self._seed_testimonials(data["testimonials"])
        self._seed_stats(data["stats"])
        self._seed_pricing(data["pricingTiers"])
        compliance_by_slug = self._seed_compliance(data["complianceAreas"], insights_by_slug)
        self._seed_services(data["services"], insights_by_slug, team_by_slug)
        self._link_insight_related_insights(data["insights"], insights_by_slug)

        self.stdout.write(self.style.SUCCESS("Seed complete."))

    def _seed_team(self, rows):
        by_slug = {}
        for row in rows:
            obj, _ = TeamMember.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "name": row["name"],
                    "role": row["role"],
                    "bio": row["bio"],
                    "email": row.get("email", ""),
                    "phone": row.get("phone", ""),
                    "whatsapp": row.get("whatsapp", ""),
                    "linkedin": row.get("linkedin", ""),
                },
            )
            obj.photo.save(f"{row['slug']}.svg", decode_data_uri_to_file(row["photo"], f"{row['slug']}.svg"), save=True)
            by_slug[row["slug"]] = obj
        self.stdout.write(f"Seeded {len(by_slug)} team members.")
        return by_slug

    def _seed_founder(self, row):
        obj, _ = Founder.objects.update_or_create(
            name=row["name"],
            defaults={
                "role": row["role"],
                "bio": row["bio"],
                "email": row.get("email", ""),
                "linkedin": row.get("linkedin", ""),
            },
        )
        obj.photo.save("founder.svg", decode_data_uri_to_file(row["photo"], "founder.svg"), save=True)
        self.stdout.write("Seeded founder.")

    def _seed_insights(self, rows):
        by_slug = {}
        for row in rows:
            obj, _ = InsightArticle.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "title": row["title"],
                    "category": row["category"],
                    "summary": row["summary"],
                    "body": row["body"],
                    "publish_date": row["publishDate"],
                    "touches_compliance": row["touchesCompliance"],
                },
            )
            obj.cover_image.save(
                f"{row['slug']}.svg", decode_data_uri_to_file(row["coverImage"], f"{row['slug']}.svg"), save=True
            )
            by_slug[row["slug"]] = obj
        self.stdout.write(f"Seeded {len(by_slug)} insight articles.")
        return by_slug

    def _link_insight_related_insights(self, rows, insights_by_slug):
        for row in rows:
            obj = insights_by_slug[row["slug"]]
            related = [insights_by_slug[s] for s in row["relatedInsightSlugs"] if s in insights_by_slug]
            obj.related_insights.set(related)

    def _seed_testimonials(self, rows):
        Testimonial.objects.all().delete()  # no stable natural key on the frontend side; simplest to replace wholesale
        for row in rows:
            obj = Testimonial.objects.create(quote=row["quote"], name=row["name"], role=row["role"])
            obj.avatar.save("avatar.svg", decode_data_uri_to_file(row["avatar"], "avatar.svg"), save=True)
        self.stdout.write(f"Seeded {len(rows)} testimonials.")

    def _seed_stats(self, rows):
        for index, row in enumerate(rows):
            Stat.objects.update_or_create(
                key=row["id"],
                defaults={"value": row["value"], "suffix": row.get("suffix", ""), "label": row["label"], "order": index},
            )
        self.stdout.write(f"Seeded {len(rows)} stats.")

    def _seed_pricing(self, rows):
        for index, row in enumerate(rows):
            match = PRICE_PATTERN.search(row["price"])
            amount = float(match.group(2).replace(",", "")) if match else None
            currency = match.group(1) if match else "AED"
            PricingTier.objects.update_or_create(
                key=row["id"],
                defaults={
                    "name": row["name"],
                    "description": row["description"],
                    "price": row["price"],
                    "amount": amount,
                    "currency": currency,
                    "period": row.get("period", ""),
                    "features": row["features"],
                    "highlighted": row.get("highlighted", False),
                    "order": index,
                },
            )
        self.stdout.write(f"Seeded {len(rows)} pricing tiers.")

    def _seed_compliance(self, rows, insights_by_slug):
        by_slug = {}
        for row in rows:
            obj, _ = ComplianceArea.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "title": row["title"],
                    "summary": row["summary"],
                    "description": row["description"],
                    "obligations": row["obligations"],
                    "notes": row.get("notes") or "",
                    "source_name": row.get("sourceName") or "",
                },
            )
            obj.hero_image.save(
                f"{row['slug']}.svg", decode_data_uri_to_file(row["heroImage"], f"{row['slug']}.svg"), save=True
            )
            related = [insights_by_slug[s] for s in row["relatedInsightSlugs"] if s in insights_by_slug]
            obj.related_insights.set(related)
            by_slug[row["slug"]] = obj
        self.stdout.write(f"Seeded {len(by_slug)} compliance areas.")
        return by_slug

    def _seed_services(self, rows, insights_by_slug, team_by_slug):
        for row in rows:
            obj, _ = Service.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "title": row["title"],
                    "pillar": row["pillar"],
                    "icon": row["icon"],
                    "summary": row["summary"],
                    "description": row["description"],
                    "included": row["included"],
                    "stats": row["stats"],
                    "process": row.get("process", []),
                    "faqs": row.get("faqs", []),
                },
            )
            obj.hero_image.save(
                f"{row['slug']}.svg", decode_data_uri_to_file(row["heroImage"], f"{row['slug']}.svg"), save=True
            )
            related_insights = [insights_by_slug[s] for s in row["relatedInsightSlugs"] if s in insights_by_slug]
            obj.related_insights.set(related_insights)
            related_team = [team_by_slug[s] for s in row["teamMemberSlugs"] if s in team_by_slug]
            obj.team_members.set(related_team)
        self.stdout.write(f"Seeded {len(rows)} services.")
