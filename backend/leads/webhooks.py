"""Outbound CRM webhook — inert by design until a real CRM exists. No external CRM
name, URL, or credentials were ever supplied (see progress-tracker.md's 2026-09-09
entry) — LEAD_WEBHOOK_URL defaults to empty, so this never fires in this environment.
Wired now so plugging in a real CRM later needs only an env var, not new code."""

import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def forward_to_external_crm(lead) -> None:
    url = settings.LEAD_WEBHOOK_URL
    if not url:
        return

    try:
        requests.post(
            url,
            json={
                "reference": lead.reference,
                "name": lead.name,
                "mobile": lead.mobile,
                "email": lead.email,
                "country": lead.country,
                "company": lead.company,
                "mainService": lead.main_service,
                "subService": lead.sub_service,
                "requirement": lead.requirement,
                "preferredContactMethod": lead.preferred_contact_method,
                "preferredContactTime": lead.preferred_contact_time,
                "sourceUrl": lead.source_url,
                "deviceType": lead.device_type,
                "createdAt": lead.created_at.isoformat(),
            },
            timeout=5,
        )
    except requests.RequestException:
        logger.warning("Lead webhook delivery failed for %s", lead.reference, exc_info=True)
