import re


def clean_text(text: str) -> str:
    
    # Clean and normalize the extracted resume text.

    if not text:
        return ""

    # Normalize line endings
    text = text.replace("\r", "\n")

    # Remove excessive newlines (more than 2)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Normalize whitespace (multiple spaces -> single space)
    text = re.sub(r"[ \t]+", " ", text)

    # Remove leading and trailing whitespace
    text = text.strip()

    return text
