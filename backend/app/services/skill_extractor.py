import re
from typing import Dict, List, Set


SKILL_VOCABULARY: Dict[str, List[str]] = {
    "programming_languages": [
        "python",
        "java",
        "c++",
        "c",
        "javascript",
        "typescript",
        "go"
    ],
    "ml_ai": [
        "machine learning",
        "deep learning",
        "neural networks",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "nlp",
        "computer vision"
    ],
    "databases": [
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "redis"
    ],
    "cloud_devops": [
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "ci/cd"
    ]
}


def normalize_text(text: str) -> str:
    
    # Normalize text for skill matching.
    
    return text.lower()


def extract_skills(
    sections: Dict[str, str],
    full_text: str
    ) -> Dict[str, List[str]]:
    
    # Extract skills from resume sections using a rule-based approach.
    

    extracted: Dict[str, Set[str]] = {}

    # Prefer Skills section if available
    search_text = sections.get("skills", full_text)
    normalized_text = normalize_text(search_text)

    for category, skills in SKILL_VOCABULARY.items():
        extracted[category] = set()

        for skill in skills:
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, normalized_text):
                extracted[category].add(skill)

    # Convert sets to sorted lists
    return {
        category: sorted(list(skill_set))
        for category, skill_set in extracted.items()
        if skill_set
    }
