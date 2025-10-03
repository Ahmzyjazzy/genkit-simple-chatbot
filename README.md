# Genkit Simple Chatbot

A simple streaming chatbot built with [Genkit](https://github.com/genkit-ai/genkit), React, and Google Gemini models.  
This project demonstrates how to build a conversational UI with real-time streaming responses using Genkit's beta features and Google AI.

## Features

- **Streaming chat UI** with Markdown support
- **Google Gemini 2.0 Flash** model integration
- **Type-safe request/response handling** using Zod schemas
- **Customizable system prompts**
- **Firebase authentication** for API calls
- **Tailwind CSS** for styling

## Project Structure

```
src/
  schema.ts                # Zod schemas for request/response validation
  common/
    genkit-beta.ts         # Genkit beta setup and model configuration
    genkit.ts              # (Optional) Genkit core setup
  app/
    api/
      simple-chatbot/
        route.ts           # API route for chat streaming
    ...                    # Next.js app files
  components/
    chat.tsx               # Main chat UI component
    code-block.tsx         # Utility for rendering code blocks
    ui/                    # Reusable UI components
  lib/
    use-agent.ts           # React hook for chat state and streaming
    utils.ts               # Utility functions for API calls and streaming
    genkit-endpoint.ts     # Helper for Genkit endpoints
    firebase.ts            # Firebase client setup
    firebase-admin.ts      # Firebase admin setup
    metadata.ts            # Metadata helpers
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

- Set your `GOOGLE_API_KEY` in your environment (required for Google Gemini).
- Configure Firebase credentials if using authentication.
```
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=***
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=***
NEXT_PUBLIC_FIREBASE_APP_ID=***
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=***
GCLOUD_PROJECT="${NEXT_PUBLIC_FIREBASE_PROJECT_ID}"
```

### 3. Run the Development Server

```bash
npm run dev
```

## Usage

- Open the app in your browser.
- Type a message in the chat input and press Enter.
- The chatbot will respond using the Gemini 2.0 Flash model, streaming the response in real time.

## Customization

- **System Prompt:**  
  You can customize the system prompt in route.ts or via context/config.

- **Model Selection:**  
  Change the model in genkit-beta.ts:
  ```typescript
  googleAI.model('gemini-2.0-flash')
  ```

- **UI Components:**  
  Modify or extend components in ui.

## Technologies Used

- [Genkit](https://genkit.dev)
- [Google Gemini](https://deepmind.google/models/gemini/)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI Components](https://ui.shadcn.com/)

## License

MIT (see [license](LICENSE.md))

## Credits

Built with ❤️ using Genkit and Google AI.  
See [Genkit documentation](https://genkit.ai/docs/) for more info.
