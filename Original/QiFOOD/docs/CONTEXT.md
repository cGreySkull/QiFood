# Food App - Detailed Flow and Features

## Overview
This app helps users identify ingredients by taking a picture and receiving an AI-generated recipe along with an image of how the dish should look.

## App Flow

##Tech Stack
- Frontend: React Native with TypeScript, Expo, and Expo Router
- Backend/Database: Supabase
- UI Framework: React Native Paper
- AI Processing: DeepSeek


### 1. **Welcome Screen**
- Displays a clean and simple UI.
- A button labeled **"Sign in with Email"**.
- Users must sign in to proceed.

### 2. **Main Dashboard**
- After signing in, users land on the main dashboard.
- The screen displays a text prompt: **"Take a picture"**.
- Two buttons are available:
  1. **"Open Camera"** - Launches the phone's camera to take a picture.
  2. **"Write Text"** - Allows users to manually input ingredients instead of taking a picture.

### 3. **Taking a Picture**
- The user presses the **"Open Camera"** button.
- The phone's camera opens, allowing them to take a picture of the ingredients.
- After taking a picture:
  - The image appears on the main screen.
  - Two buttons appear:
    1. **"Take Picture Again"** - Retakes the photo if needed.
    2. **"Generate Recipe"** - Sends the picture to AI for processing.

### 4. **Processing the Recipe**
- Upon pressing **"Generate Recipe"**, the image is sent to the AI for analysis.
- The AI identifies the ingredients and generates:
  - A detailed recipe using the identified ingredients.
  - A visual representation of how the final dish should look.

### 5. **Displaying the Recipe**
- The generated recipe is displayed on the screen.
- The screen includes:
  - The detected ingredients list.
  - Step-by-step cooking instructions.
  - An AI-generated image of the expected final dish.

## Features and Functionalities

### **1. User Authentication**
- Email-based sign-in system.
- Ensures secure access to personalized content.

### **2. Image Processing with AI**
- AI model identifies ingredients from the picture.
- Ensures accuracy in ingredient recognition.

### **3. Recipe Generation**
- AI generates a complete recipe based on identified ingredients.
- Provides step-by-step cooking instructions.
- Generates an expected dish image.

### **4. Manual Ingredient Input**
- Users can type in ingredients instead of using a picture.
- AI will still generate a recipe and dish image.

### **5. User-Friendly Interface**
- Clean UI for seamless navigation.
- Easy-to-use buttons for taking pictures and generating recipes.

## Future Enhancements (Optional)
- Save and share recipes.
- User profile customization.
- Multi-language support.
- Nutrition information integration.

## Conclusion
This structured flow and feature breakdown ensures that developers can efficiently implement the app's core functionalities while maintaining an intuitive user experience.

## Database Schema

### Tables

#### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  dietary_preferences JSONB,
  is_email_verified BOOLEAN DEFAULT FALSE
);
```

#### 2. recipes
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions TEXT[] NOT NULL,
  image_url TEXT,
  ai_generated_image_url TEXT,
  cooking_time INTEGER,
  difficulty_level VARCHAR(50),
  servings INTEGER,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
```

#### 3. ingredients_photos
```sql
CREATE TABLE ingredients_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  detected_ingredients JSONB,
  confidence_scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ingredients_photos_user_id ON ingredients_photos(user_id);
```

#### 4. user_preferences
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  dietary_restrictions TEXT[],
  preferred_cuisine TEXT[],
  allergies TEXT[],
  cooking_skill_level VARCHAR(50),
  preferred_units VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. recipe_history
```sql
CREATE TABLE recipe_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cooked_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT
);

CREATE INDEX idx_recipe_history_user_id ON recipe_history(user_id);
CREATE INDEX idx_recipe_history_recipe_id ON recipe_history(recipe_id);
```

## Folder Structure
```
src/
├── app/                      # Expo Router screens and navigation
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (main)/              # Main app routes
│   │   ├── home/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── profile/
│   │   │   ├── index.tsx
│   │   │   └── edit.tsx
│   │   └── settings/
│   │       └── index.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── components/              # Reusable components
│   ├── common/             # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── forms/              # Form-specific components
│   │   ├── LoginForm.tsx
│   │   └── RecipeForm.tsx
│   ├── recipe/             # Recipe-related components
│   │   ├── RecipeCard.tsx
│   │   ├── IngredientsList.tsx
│   │   └── Instructions.tsx
│   └── camera/             # Camera-related components
│       ├── CameraView.tsx
│       └── PhotoPreview.tsx
├── contexts/               # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useCamera.ts
│   └── useRecipes.ts
├── services/              # API and external services
│   ├── api/              # API clients
│   │   ├── supabase.ts
│   │   └── deepseek.ts
│   ├── camera.ts        # Camera functionality
│   └── storage.ts       # Local storage
├── store/                # State management
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── recipeSlice.ts
│   └── index.ts
├── styles/              # Global styles and themes
│   ├── theme.ts
│   └── typography.ts
├── types/              # TypeScript type definitions
│   ├── api.ts
│   ├── navigation.ts
│   └── models.ts
├── utils/             # Utility functions
│   ├── validation.ts
│   ├── formatting.ts
│   └── permissions.ts
├── constants/        # App constants
│   ├── config.ts
│   └── endpoints.ts
└── assets/          # Static assets
    ├── images/
    └── icons/
```

## Development Roadmap

### Phase 1: Project Setup and Authentication
1. **Initial Setup**
   - Initialize Expo project with TypeScript
   - Set up Expo Router
   - Configure React Native Paper
   - Set up Supabase client

2. **Authentication Flow**
   - Create sign-in screen
   - Implement email authentication with Supabase
   - Set up protected routes
   - Create authentication context and hooks

### Phase 2: Camera and Image Handling
1. **Camera Implementation**
   - Set up Expo Camera
   - Create camera screen component
   - Implement image capture functionality
   - Add image preview and retake options

2. **Image Storage**
   - Configure Supabase storage
   - Implement image upload functionality
   - Create image processing service

### Phase 3: AI Integration
1. **DeepSeek Integration**
   - Set up DeepSeek API client
   - Create ingredient detection service
   - Implement recipe generation service
   - Add AI image generation service

2. **Processing Flow**
   - Create loading states and UI
   - Implement error handling
   - Add retry mechanisms

### Phase 4: Recipe Management
1. **Recipe Display**
   - Create recipe detail screen
   - Implement ingredient list component
   - Add cooking instructions component
   - Display AI-generated image

2. **Recipe Storage**
   - Implement recipe saving functionality
   - Create favorites system
   - Add recipe history

### Phase 5: Manual Input Feature
1. **Text Input**
   - Create ingredient input screen
   - Implement ingredient suggestion system
   - Add validation

### Phase 6: Polish and Testing
1. **UI/UX Refinement**
   - Add animations and transitions
   - Implement loading states
   - Add error handling UI
   - Ensure responsive design

2. **Testing**
   - Unit tests for core functionality
   - Integration tests
   - User acceptance testing
   - Performance optimization

### Phase 7: Deployment
1. **Final Steps**
   - App store preparation
   - Documentation
   - Beta testing
   - Production deployment

## Development Guidelines

### Current Focus
Start with Phase 1 and proceed sequentially. Each phase should be completed and tested before moving to the next.

### Priority Tasks (Phase 1)
1. Set up development environment
2. Initialize project with required dependencies
3. Create basic folder structure
4. Implement authentication system

### Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   DEEPSEEK_API_KEY=your_deepseek_key
   ```
4. Start the development server:
   ```bash
   npx expo start
   ```