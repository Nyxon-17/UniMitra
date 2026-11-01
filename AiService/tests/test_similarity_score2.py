import sys
sys.stdout.reconfigure(encoding='utf-8')
from app.services.embedding_service import embedding_service
from app.core.database import execute_query

query = "What is the disbursement amount of Ishan Uday Special Scholarship for general courses?"
q_vec = embedding_service.embed_query(query)
vec_str = "[" + ",".join(f"{x:.6f}" for x in q_vec) + "]"

sql = """
SELECT id, document_id, page_number, clause_reference, 
       1 - (embedding <=> %s::vector) AS similarity, content
FROM ai_document_chunks
ORDER BY embedding <=> %s::vector ASC
LIMIT 5;
"""

rows = execute_query(sql, (vec_str, vec_str))
print(f"Query: '{query}'")
for r in rows:
    print(f"  Similarity: {r['similarity']:.4f} | Page: {r['page_number']} | Clause: {r['clause_reference']}")
    print(f"  Snippet: {r['content'][:120]}...\n")

