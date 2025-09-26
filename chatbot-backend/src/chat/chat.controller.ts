import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  chat(@Body() body: { message: string }) {
    return { reply: this.chatService.sendMessage(body.message) };
  }

  // New endpoint for suggestions
  @Get('suggestions')
  suggestions(@Query('q') query: string) {
    return { suggestions: this.chatService.getSuggestions(query) };
  }
}
