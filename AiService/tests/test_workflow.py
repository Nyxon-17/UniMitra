import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.workflows.rag_graph import rag_workflow

res_en = rag_workflow.run("How do I apply for hostel admission and what are the fees?", language="en")
res_as = rag_workflow.run("মই কেনেকৈ হোষ্টেলৰ বাবে আবেদন কৰিম?", language="as")
res_hi = rag_workflow.run("নমস্কাৰ, আপুনি মোক কি সহায় কৰিব পাৰে?", language="as")

output = f"""=== ENGLISH QUERY RESULT ===
Answer: {res_en.get('answer')}
Source: {res_en.get('source')}
Citation: {res_en.get('page')}
Is Unverified: {res_en.get('is_unverified')}

=== ASSAMESE QUERY RESULT ===
Answer: {res_as.get('answer')}
Source: {res_as.get('source')}
Citation: {res_as.get('page')}
Is Unverified: {res_as.get('is_unverified')}

=== ASSAMESE GREETING RESULT ===
Answer: {res_hi.get('answer')}
Source: {res_hi.get('source')}
Is Unverified: {res_hi.get('is_unverified')}
"""

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_output.txt"), "w", encoding="utf-8") as f:
    f.write(output)

print("Saved output to test_output.txt successfully!")
