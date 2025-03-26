import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../../constants/config';

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export const ai = {
  async detectIngredients(imageUrl: string) {
    try {
      // Convert signed URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(`data:image/jpeg;base64,${base64Data}`);
        };
        reader.readAsDataURL(blob);
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a JSON generator. Always respond with a valid JSON object containing ingredients and quantities. Example: {\"tomato\": \"2 medium\"}. If no ingredients are visible, return {}."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "List ingredients in this image as a JSON object. Format: {\"ingredient\": \"quantity\"}. ONLY return the JSON object, no other text."
              },
              {
                type: "image_url",
                image_url: { url: base64 }
              }
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0
      });

      const content = completion.choices[0].message.content?.trim() || '{}';
      console.log('AI response:', content);

      try {
        // Clean the response by removing markdown and extra characters
        const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return {};
      }
    } catch (error) {
      console.error('Ingredient detection error:', error);
      return {};
    }
  },

  async generateRecipe(ingredients: string[]) {
    try {
      if (!ingredients || ingredients.length === 0) {
        console.log('No ingredients provided');
        return null;
      }

      console.log('Generating recipe for ingredients:', ingredients);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional chef. Create a recipe with numbered steps. Format: 1. First step, 2. Second step, etc. No section headers or bullet points."
          },
          {
            role: "user",
            content: `Create a recipe using these ingredients: ${ingredients.join(', ')}. Start with a simple title, then list numbered steps. Each step should be a complete instruction.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const recipe = response.choices[0].message?.content;
      if (!recipe) {
        console.log('No recipe generated');
        return null;
      }

      console.log('Generated recipe:', recipe);
      return recipe;
    } catch (error: any) {
      console.error('Recipe generation error:', error);
      return null;
    }
  },

 
}; 