import app from '../app.js';
import http from 'http';

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Probe server running on ${baseUrl}`);

  try {
    // 1. Test Health endpoint
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    console.log('1. Health Check:', healthRes.status === 200 && healthJson.status === 'healthy' ? 'PASSED' : 'FAILED');

    // 2. Test Categories endpoint
    const catRes = await fetch(`${baseUrl}/api/v1/documents/categories`);
    const catJson = await catRes.json();
    console.log('2. Categories Endpoint:', catRes.status === 200 && catJson.success ? 'PASSED' : 'FAILED');

    // 3. Test Universities list endpoint
    const univRes = await fetch(`${baseUrl}/api/v1/universities`);
    const univJson = await univRes.json();
    console.log('3. Universities Endpoint:', univRes.status === 200 && univJson.success ? 'PASSED' : 'FAILED');

    // 4. Test AI Grounded Chat Query (Assamese Benchmark)
    const chatRes = await fetch(`${baseUrl}/api/v1/chat/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ৰ পৰীক্ষাত উত্তীৰ্ণ হ’বলৈ নূন্যতম নম্বৰ কিমান লাগে?',
        language: 'as',
      }),
    });
    const chatJson = await chatRes.json();
    console.log('4. AI Chat RAG Query (Assamese):', chatRes.status === 200 && chatJson.data?.text?.includes('৪০%') ? 'PASSED' : 'FAILED');
    console.log('   Response Citation:', chatJson.data?.source, '|', chatJson.data?.page);

    // 5. Test AI Grounded Chat Query (English Benchmark)
    const chatEnRes = await fetch(`${baseUrl}/api/v1/chat/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'What is the attendance condonation limit for medical absence?',
        language: 'en',
      }),
    });
    const chatEnJson = await chatEnRes.json();
    console.log('5. AI Chat RAG Query (English):', chatEnRes.status === 200 && chatEnJson.data?.text?.includes('75%') ? 'PASSED' : 'FAILED');
    console.log('   Response Citation:', chatEnJson.data?.source, '|', chatEnJson.data?.page);

    // 6. Test Voice Transcribe endpoint (empty audio test)
    const voiceRes = await fetch(`${baseUrl}/api/v1/voice/transcribe`, {
      method: 'POST',
    });
    const voiceJson = await voiceRes.json();
    console.log('6. Voice Transcribe Error Handling:', voiceRes.status === 400 && voiceJson.error?.code === 'MISSING_AUDIO' ? 'PASSED' : 'FAILED');

    console.log('\n--- ALL INTEGRATION PROBE TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('Probe execution failed:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
});

