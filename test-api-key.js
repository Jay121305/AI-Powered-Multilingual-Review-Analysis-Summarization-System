// Test script to verify Gemini API key
const API_KEY = 'AIzaSyBUiALGa0tfDnD0sV1L-krFVXkIdLFXaVk';

async function testApiKey() {
    console.log('Testing API key...');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Say hello'
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✓ API Key is VALID and working!');
            console.log('Response:', data);
        } else {
            console.error('✗ API Key is INVALID or expired');
            console.error('Status:', response.status);
            console.error('Error:', data);
        }
    } catch (error) {
        console.error('✗ Error testing API key:', error.message);
    }
}

testApiKey();
