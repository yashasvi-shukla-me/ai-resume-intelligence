import io
import pdfplumber
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel


class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AI Resume Intelligence API is running"}


@app.post("/analyze")
def analyze_resume(request: ResumeRequest):
    return {
        "received_resume_text": request.resume_text,
        "received_job_description": request.job_description
    }

@app.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):
    contents = file.file.read()

    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        pages_text = []
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)

    full_text = "\n".join(pages_text)

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "extracted_text_length": len(full_text),
        "text_preview": full_text[:300]
    }
