import re
from typing import Dict, List


SECTION_HEADERS = {
    "skills": [
        "skills",
        "technical skills",
        "core skills",
        "key skills"
    ],
    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "employment"
    ],
    "education": [
        "education",
        "academic background",
        "educational qualifications"
    ],
    "projects": [
        "projects",
        "academic projects",
        "personal projects"
    ],
    "certifications": [
        "certifications",
        "certificates"
    ]
}


def is_section_header(line: str) -> str | None:
    
    # Determine whether a line is a section header.
    # Returns the canonical section name if matched, else None.
    

    if not line:
        return None

    normalized = line.strip().lower()

    # Reject long lines (likely sentences)
    if len(normalized) > 40:
        return None

    # Reject lines with too many words
    if len(normalized.split()) > 5:
        return None

    for section, headers in SECTION_HEADERS.items():
        for header in headers:
            if normalized == header:
                return section

    return None


def extract_sections(text: str) -> Dict[str, str]:

    # Extract resume sections based on detected headers.
    

    sections: Dict[str, List[str]] = {}
    current_section: str | None = None

    lines = [line.strip() for line in text.split("\n")]

    for line in lines:
        header = is_section_header(line)

        if header:
            current_section = header
            if current_section not in sections:
                sections[current_section] = []
            continue

        if current_section:
            sections[current_section].append(line)

    # Join lines for each section
    final_sections = {
        section: "\n".join(content).strip()
        for section, content in sections.items()
        if content
    }

    return final_sections
