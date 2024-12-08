// services/llmService.ts
export const generateStoryContent = async (
  worldContext: string,
  currentStage: string,
  playerChoices: string[]
) => {
  // Implementation will depend on your chosen LLM service
  // Example using AWS Bedrock:
  const response = await fetch('/api/generate-story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      worldContext,
      currentStage,
      playerChoices,
    }),
  });

  return response.json();
};
