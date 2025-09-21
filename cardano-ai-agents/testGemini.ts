import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI("AIzaSyDuOHhb05tuOEO5jt_Z7vh0Hw1cVx4bM6E");

(async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent("Hello from Gemini + Cardano setup!");
  console.log(result.response.text());
})();