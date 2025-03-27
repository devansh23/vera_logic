import { Mistral } from '@mistralai/mistralai';
import { log } from './logger';
// Load environment variables from .env file
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMistralApi() {
  console.log('🔍 Testing Mistral AI API Connection');
  console.log('==================================\n');
  
  // Get API key from environment variables
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    console.error('❌ MISTRAL_API_KEY environment variable is not set');
    process.exit(1);
  }
  
  console.log('1. Initializing Mistral AI client...');
  try {
    // Initialize client
    const mistral = new Mistral({ apiKey });
    console.log('✅ Mistral client initialized');
    
    console.log('\n2. Making a simple API request...');
    const response = await mistral.chat.complete({
      model: 'mistral-tiny',
      messages: [
        { role: 'user', content: 'Hello! Please respond with a very short greeting.' }
      ],
      maxTokens: 10
    });
    
    if (response && response.choices && response.choices.length > 0) {
      console.log('✅ API request successful');
      console.log('Response:', response.choices[0]?.message?.content || 'No content');
      
      console.log('\nUsage information:');
      console.log('- Model:', response.model);
      console.log('- Prompt tokens:', response.usage?.promptTokens);
      console.log('- Completion tokens:', response.usage?.completionTokens);
      console.log('- Total tokens:', response.usage?.totalTokens);
    } else {
      console.error('❌ API request failed - unexpected response format');
    }
  } catch (error) {
    console.error('❌ API request error:');
    if (error instanceof Error) {
      console.error('- Message:', error.message);
      console.error('- Stack:', error.stack);
      
      if (error.message.includes('401')) {
        console.error('\n⚠️ Authentication failed. Please check your Mistral API key.');
      } else if (error.message.includes('429')) {
        console.error('\n⚠️ Rate limit exceeded. Please wait before trying again.');
      } else if (error.message.includes('5')) {
        console.error('\n⚠️ Mistral API service error. Please try again later.');
      }
    } else {
      console.error('- Unknown error:', error);
    }
    process.exit(1);
  }
  
  console.log('\n🏁 Mistral AI API test completed');
}

// Run the test
testMistralApi().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
}); 