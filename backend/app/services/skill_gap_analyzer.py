from typing import Dict, List, Set
from backend.app.services.semantic_matcher import SemanticMatcher


ROLE_BASED_WEIGHTS = {
    "ml_engineer": {
        "programming_languages": 3.0,
        "ml_ai": 4.0,
        "databases": 2.0,
        "cloud_devops": 2.0
    },
    "backend_engineer": {
        "programming_languages": 4.0,
        "ml_ai": 1.5,
        "databases": 3.0,
        "cloud_devops": 3.0
    },
    "frontend_engineer": {
        "programming_languages": 4.0,
        "ml_ai": 1.0,
        "databases": 1.5,
        "cloud_devops": 1.5
    }
}


def analyze_skill_gap(
    resume_skills: Dict[str, List[str]],
    jd_skills: Dict[str, List[str]],
    job_role: str = "backend_engineer"
) -> Dict:

    matcher = SemanticMatcher()

    matched_skills: Dict[str, List[str]] = {}
    missing_skills: Dict[str, List[str]] = {}

    weighted_required = 0.0
    weighted_matched = 0.0

    role_weights = ROLE_BASED_WEIGHTS.get(job_role, {})

    for category, required_skills in jd_skills.items():
        required_set: Set[str] = set(required_skills)
        resume_set: Set[str] = set(resume_skills.get(category, []))

        weight = role_weights.get(category, 1.0)

        # Exact matches
        exact_matched = set(required_set & resume_set)
        missing = set(required_set - resume_set)

        # Semantic matching on missing skills
        semantic_matches = matcher.match_skills(
            resume_skills=list(resume_set),
            jd_skills=list(missing)
        )

        # Exact matches (full credit)
        exact_credit = len(exact_matched) * weight

        # Semantic matches (partial credit)
        semantic_credit = 0.0
        semantically_matched = set()

        for resume_skill, jd_skill, score in semantic_matches:
            semantically_matched.add(jd_skill)
            semantic_credit += score * weight

        # Combine matches
        all_matched = exact_matched | semantically_matched
        final_missing = missing - semantically_matched

        weighted_matched += exact_credit + semantic_credit


        if all_matched:
            matched_skills[category] = sorted(all_matched)
            weighted_matched += len(all_matched) * weight

        if final_missing:
            missing_skills[category] = sorted(final_missing)

        weighted_required += len(required_set) * weight

    ats_score = 0.0
    if weighted_required > 0:
        ats_score = round((weighted_matched / weighted_required) * 100, 2)

    return {
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "weighting_strategy": "role-based + semantic"
    }
