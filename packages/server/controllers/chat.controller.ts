import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

//Implementation detail
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, { message: 'Prompt is required' })
      .max(1000, { message: 'Prompt is too long (max is 1000 characters)' }),
   conversationId: z.string().uuid(),
});

//Public interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseresult = chatSchema.safeParse(req.body);
      if (!parseresult.success) {
         return res.status(400).json({ error: parseresult.error.format() });
      }
      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);

         res.json(response.message);
      } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Failed to generate response' });
      }
   },
};
