from typing import Dict, List


def generate_feedback(
    ats_score: float,
    missing_skills: Dict[str, List[str]]
    ) -> List[str]:
    
    # generate human readable feedback based on ATS score and missing skills.
    

    feedback: List[str] = []

    if ats_score >= 80:
        feedback.append(
            "Your resume is a strong match for this job description."
        )
    elif ats_score >= 60:
        feedback.append(
            "Your resume is a moderate match, but there is room for improvement."
        )
    else:
        feedback.append(
            "Your resume has significant gaps compared to the job requirements."
        )

    for category, skills in missing_skills.items():
        if skills:
            skill_list = ", ".join(skills)
            feedback.append(
                f"Consider adding or highlighting the following {category.replace('_', ' ')} skills: {skill_list}."
            )

    return feedback
