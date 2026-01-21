from typing import List, Tuple
from sentence_transformers import SentenceTransformer, util
import torch



class SemanticMatcher:
    
    # Singleton semantic matcher using sentence embeddings.
    

    _instance = None
    _model = None
    _embedding_cache = {}

    def __new__(cls, model_name: str = "all-MiniLM-L6-v2"):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._model = SentenceTransformer(model_name)
        return cls._instance

    def _get_embedding(self, text: str):
        
        # Get cached embedding for a text, or compute if not cached
        
        if text not in self._embedding_cache:
            self._embedding_cache[text] = self._model.encode(
                text, convert_to_tensor=True
            )
        return self._embedding_cache[text]

    def match_skills(
        self,
        resume_skills: List[str],
        jd_skills: List[str],
        threshold: float = 0.75
        ) -> List[Tuple[str, str, float]]:

        if not resume_skills or not jd_skills:
            return []

        resume_embeddings = torch.stack(
            [self._get_embedding(s) for s in resume_skills]
        )

        jd_embeddings = torch.stack(
            [self._get_embedding(s) for s in jd_skills]
        )

        cosine_scores = util.cos_sim(resume_embeddings, jd_embeddings)


        matches = []

        for i, resume_skill in enumerate(resume_skills):
            for j, jd_skill in enumerate(jd_skills):
                score = float(cosine_scores[i][j])
                if score >= threshold:
                    matches.append(
                        (resume_skill, jd_skill, round(score, 3))
                    )

        return matches
