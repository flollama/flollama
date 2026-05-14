# Complete Guide to Flollama Chat API

## Overview

The Flollama Chat API (https://flollama.in/api/chat) is a Public and Free REST API, it provides a streaming chat interface powered by Gemini 3.1 Flash Lite. It can be used without any API token, membership, registration or payment. This guide covers how to interact with the API using various programming languages and approaches.

## API Specification

**Endpoint:** `https://flollama.in/api/chat`  
**Method:** `POST`  
**Content-Type:** `application/json`  
**Response:** Streaming text/plain

### Request Format

```json
{
  "messages": [
    {
      "role": "system|user|assistant",
      "content": "Message content"
    }
  ]
}
```

### Response Format

The API returns a streaming response where each chunk contains part of the AI's response content.

---

## Implementation Examples

### 1. JavaScript/Node.js

#### Basic Fetch API

```javascript
async function chatWithFlollama(messages) {
  try {
    const response = await fetch('https://flollama.in/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
      console.log('Chunk:', chunk); // Process each chunk as it arrives
    }

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
const messages = [
  { role: 'user', content: 'Hello, how are you?' }
];

chatWithFlollama(messages)
  .then(response => console.log('Complete response:', response))
  .catch(error => console.error('Error:', error));
```

#### Using Axios with Streaming

```javascript
const axios = require('axios');

async function streamChat(messages) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://flollama.in/api/chat',
      data: { messages },
      responseType: 'stream'
    });

    let fullResponse = '';
    
    response.data.on('data', (chunk) => {
      const text = chunk.toString();
      fullResponse += text;
      console.log('Stream chunk:', text);
    });

    response.data.on('end', () => {
      console.log('Stream ended. Full response:', fullResponse);
    });

    response.data.on('error', (error) => {
      console.error('Stream error:', error);
    });

  } catch (error) {
    console.error('Request error:', error);
  }
}
```

#### React Hook Implementation

```javascript
import { useState, useCallback } from 'react';

function useFlollamaChat() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (messages) => {
    setIsLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('https://flollama.in/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setResponse(prev => prev + chunk);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { response, isLoading, error, sendMessage };
}
```

### 2. Python

#### Using Requests with Streaming

```python
import requests
import json

def chat_with_flollama(messages):
    url = "https://flollama.in/api/chat"
    payload = {"messages": messages}
    
    try:
        with requests.post(url, json=payload, stream=True) as response:
            response.raise_for_status()
            
            full_response = ""
            for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
                if chunk:
                    full_response += chunk
                    print(f"Chunk: {chunk}", end="", flush=True)
            
            return full_response
            
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Usage
messages = [
    {"role": "user", "content": "Explain quantum computing in simple terms"}
]

response = chat_with_flollama(messages)
print(f"\nFull response: {response}")
```

#### Async Python with aiohttp

```python
import aiohttp
import asyncio
import json

async def async_chat(messages):
    url = "https://flollama.in/api/chat"
    payload = {"messages": messages}
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as response:
            if response.status == 200:
                full_response = ""
                async for chunk in response.content.iter_chunked(1024):
                    text = chunk.decode('utf-8')
                    full_response += text
                    print(f"Chunk: {text}", end="", flush=True)
                return full_response
            else:
                print(f"Error: {response.status}")
                return None

# Usage
messages = [{"role": "user", "content": "What is machine learning?"}]
asyncio.run(async_chat(messages))
```

### 3. cURL

#### Basic cURL Command

```bash
curl -X POST "https://flollama.in/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }' \
  --no-buffer
```

#### cURL with Multiple Messages

```bash
curl -X POST "https://flollama.in/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful coding assistant."},
      {"role": "user", "content": "Write a Python function to calculate fibonacci numbers."}
    ]
  }' \
  --no-buffer
```

### 4. Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type Message struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

type ChatRequest struct {
    Messages []Message `json:"messages"`
}

func chatWithFlollama(messages []Message) error {
    url := "https://flollama.in/api/chat"
    
    requestBody := ChatRequest{Messages: messages}
    jsonBody, err := json.Marshal(requestBody)
    if err != nil {
        return err
    }

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonBody))
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("HTTP error: %d", resp.StatusCode)
    }

    // Read streaming response
    buffer := make([]byte, 1024)
    fullResponse := ""
    
    for {
        n, err := resp.Body.Read(buffer)
        if err != nil && err != io.EOF {
            return err
        }
        if n == 0 {
            break
        }
        
        chunk := string(buffer[:n])
        fullResponse += chunk
        fmt.Print(chunk) // Print each chunk as it arrives
    }
    
    fmt.Printf("\nFull response: %s\n", fullResponse)
    return nil
}

func main() {
    messages := []Message{
        {Role: "user", Content: "Explain the concept of recursion"},
    }
    
    if err := chatWithFlollama(messages); err != nil {
        fmt.Printf("Error: %v\n", err)
    }
}
```

### 5. Java

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.io.BufferedReader;
import java.io.StringReader;
import com.google.gson.Gson;
import java.util.List;
import java.util.ArrayList;

public class FlollamaClient {
    
    static class Message {
        String role;
        String content;
        
        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
    
    static class ChatRequest {
        List<Message> messages;
        
        public ChatRequest(List<Message> messages) {
            this.messages = messages;
        }
    }
    
    public static void chatWithFlollama(List<Message> messages) {
        try {
            Gson gson = new Gson();
            ChatRequest request = new ChatRequest(messages);
            String jsonBody = gson.toJson(request);
            
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://flollama.in/api/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
            
            HttpResponse<String> response = client.send(httpRequest, 
                HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                System.out.println("Response: " + response.body());
            } else {
                System.err.println("Error: " + response.statusCode());
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        List<Message> messages = new ArrayList<>();
        messages.add(new Message("user", "What are the benefits of renewable energy?"));
        
        chatWithFlollama(messages);
    }
}
```

### 6. PHP

```php
<?php

function chatWithFlollama($messages) {
    $url = 'https://flollama.in/api/chat';
    $data = json_encode(['messages' => $messages]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => $data
        ]
    ]);
    
    $stream = fopen($url, 'r', false, $context);
    
    if (!$stream) {
        echo "Error opening stream\n";
        return;
    }
    
    $fullResponse = '';
    while (!feof($stream)) {
        $chunk = fread($stream, 1024);
        if ($chunk !== false) {
            $fullResponse .= $chunk;
            echo $chunk; // Output each chunk immediately
        }
    }
    
    fclose($stream);
    return $fullResponse;
}

// Usage
$messages = [
    ['role' => 'user', 'content' => 'Explain photosynthesis']
];

$response = chatWithFlollama($messages);
echo "\nFull response received\n";
?>
```

### 7. Ruby

```ruby
require 'net/http'
require 'json'

def chat_with_flollama(messages)
  uri = URI('https://flollama.in/api/chat')
  
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  
  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request.body = { messages: messages }.to_json
  
  response = http.request(request)
  
  if response.code == '200'
    puts "Response: #{response.body}"
    return response.body
  else
    puts "Error: #{response.code} - #{response.message}"
    return nil
  end
rescue => e
  puts "Error: #{e.message}"
  return nil
end

# Usage
messages = [
  { role: 'user', content: 'What is artificial intelligence?' }
]

chat_with_flollama(messages)
```

---

## Best Practices

### 1. Error Handling
Always implement proper error handling for network requests, HTTP status codes, and streaming interruptions.

### 2. Message Structure
Structure your messages array properly with appropriate roles:
- `system`: Set the context/instructions for the AI
- `user`: User messages
- `assistant`: Previous AI responses (for conversation context)

### 3. Streaming Considerations
- Process chunks as they arrive for real-time user experience
- Handle connection interruptions gracefully
- Consider buffering for UI updates to avoid flickering

### 4. Rate Limiting
Implement client-side rate limiting to avoid overwhelming the API.

### 5. Security
- Never expose API keys in client-side code
- Validate and sanitize user inputs before sending
- Implement proper CORS handling for web applications

---

## Common Use Cases

### 1. Chatbot Integration
```javascript
// Simple chatbot example
function createChatbot() {
  let conversationHistory = [];
  
  return {
    async sendMessage(userMessage) {
      conversationHistory.push({ role: 'user', content: userMessage });
      
      const response = await chatWithFlollama(conversationHistory);
      
      conversationHistory.push({ role: 'assistant', content: response });
      return response;
    },
    
    clearHistory() {
      conversationHistory = [];
    }
  };
}
```

### 2. Code Generation Assistant
```javascript
const codeMessages = [
  { 
    role: 'system', 
    content: 'You are a coding assistant. Provide clean, well-commented code.' 
  },
  { 
    role: 'user', 
    content: 'Create a React component for a todo list' 
  }
];
```

### 3. Content Generation
```javascript
const contentMessages = [
  { 
    role: 'system', 
    content: 'You are a creative writing assistant.' 
  },
  { 
    role: 'user', 
    content: 'Write a short story about time travel' 
  }
];
```

---

## Troubleshooting

### Common Issues

1. **Connection Timeout**: Implement retry logic with exponential backoff
2. **Incomplete Streams**: Handle partial responses and reconnection
3. **CORS Errors**: Ensure proper headers are set for web applications
4. **Large Responses**: Consider implementing response size limits

### Debug Tips

- Log request payloads and response status codes
- Monitor network connectivity
- Test with simple messages first
- Use browser dev tools for web implementations

---

This guide provides comprehensive examples for integrating with the Flollama Chat API across multiple programming languages and scenarios. Choose the implementation that best fits your project's requirements and technical stack.
