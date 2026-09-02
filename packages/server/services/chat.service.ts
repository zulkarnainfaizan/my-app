import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import { response } from 'express';
import { llmClient } from '../llm/client';

type ChatResponse = {
   id: string;
   message: string;
};

//Public interface
//Leaky abstraction
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         instructions:
            'You are a helpful assistant that provides concise and accurate answers.',
         prompt,
         temperature: 0.2,
         maxTokens: 100,
         previousResponseId:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.text,
      };
   },
};
