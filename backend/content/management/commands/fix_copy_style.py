import re
import sys

from django.core.management.base import BaseCommand
from django.db import transaction

from content.models import ComplianceArea, Founder, InsightArticle, Service, TeamMember, Testimonial

# " — " (em dash) and the Oxford/serial comma before "and"/"or" — a copy-style
# cleanup pass run once over the whole site's written content (see
# progress-tracker.md). Kept as a re-runnable command, not a one-off script,
# so the same fix can be applied to any environment's database (local sqlite in
# dev, the deployed Postgres instance in production) through the normal Django
# ORM instead of hand-editing rows per environment.
#
# "â€”" is the same em dash mangled by a UTF-8-as-Latin-1 mis-decode somewhere
# upstream (content pasted from another tool, then saved through the wrong
# encoding once). Matched alongside the real character so both are caught in
# the same pass and neither can silently reappear.
EM_DASH = re.compile(r"\s+(?:—|â€”)\s+")
OXFORD_AND = re.compile(r", and ")
OXFORD_OR = re.compile(r", or ")

# (model, [plain char/text fields], [JSON fields holding str/list[str]/list[dict]])
TARGETS = [
    (Founder, ["bio"], []),
    (TeamMember, ["bio"], []),
    (Testimonial, ["quote"], []),
    (InsightArticle, ["summary"], ["body"]),
    (ComplianceArea, ["summary", "description", "notes"], ["obligations", "included"]),
    (Service, ["summary", "description", "philosophy_title", "cta_label"], ["included", "stats", "process", "faqs"]),
]


def needs_fix(value):
    return isinstance(value, str) and (EM_DASH.search(value) or OXFORD_AND.search(value) or OXFORD_OR.search(value))


def clean(text):
    text = EM_DASH.sub(", ", text)
    text = OXFORD_AND.sub(" and ", text)
    text = OXFORD_OR.sub(" or ", text)
    return text


def fix_json_value(node):
    """Recursively fixes strings inside a JSONField's decoded Python value
    (dict/list/str) in place. Returns True if anything changed."""
    changed = False
    if isinstance(node, dict):
        for key, val in node.items():
            if isinstance(val, str) and needs_fix(val):
                node[key] = clean(val)
                changed = True
            elif isinstance(val, (dict, list)):
                changed = fix_json_value(val) or changed
    elif isinstance(node, list):
        for i, val in enumerate(node):
            if isinstance(val, str) and needs_fix(val):
                node[i] = clean(val)
                changed = True
            elif isinstance(val, (dict, list)):
                changed = fix_json_value(val) or changed
    return changed


class Command(BaseCommand):
    help = (
        "Removes the ' — ' em dash and the Oxford comma before 'and'/'or' from every "
        "content field (team bios, testimonials, insights, compliance areas, services). "
        "Safe to re-run — a field with nothing to fix is left untouched. Defaults to a "
        "dry run; pass --apply to write the changes."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Actually save the changes. Without this flag, only a report is printed.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        apply_changes = options["apply"]
        total_fields = 0
        total_rows = 0

        for model, char_fields, json_fields in TARGETS:
            for obj in model.objects.all():
                changed_fields = []

                for field in char_fields:
                    value = getattr(obj, field)
                    if needs_fix(value):
                        setattr(obj, field, clean(value))
                        changed_fields.append(field)

                for field in json_fields:
                    value = getattr(obj, field)
                    if value and fix_json_value(value):
                        setattr(obj, field, value)
                        changed_fields.append(field)

                if changed_fields:
                    total_rows += 1
                    total_fields += len(changed_fields)
                    label = getattr(obj, "slug", None) or getattr(obj, "name", None) or obj.pk
                    self.stdout.write(f"{model.__name__}({label}): {', '.join(changed_fields)}")
                    if apply_changes:
                        obj.save(update_fields=changed_fields)

        if apply_changes:
            self.stdout.write(self.style.SUCCESS(f"\nApplied: {total_fields} field(s) across {total_rows} row(s)."))
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"\nDry run: {total_fields} field(s) across {total_rows} row(s) would change. "
                    "Re-run with --apply to write them."
                )
            )
            # Non-zero exit whenever something would change, so this same dry run
            # doubles as a pre-commit check that blocks the commit until content
            # is either fixed (--apply, locally) or intentionally left as-is.
            if total_fields:
                sys.exit(1)
