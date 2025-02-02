import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Student, Role.Instructor, Role.Admin)
  @Get('history')
  async getMessageHistory(
    @Req() Request: Request,
    @Query('userID2') userID2: number,
  ) {
    console.log(userID2);
    const userID1 = Request['user'].user_id;
    return this.chatService.getMessagesBetweenUsers(userID1, userID2);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Student, Role.Instructor, Role.Admin)
  @Get('chats')
  async getChatSidebar(@Req() request: Request) {
    const userId = request['user'].user_id;
    return this.chatService.getChatUsers(userId);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Student, Role.Instructor, Role.Admin)
  @Get('search')
  async userSearch(@Req() request: Request, @Query('query') query: string) {
    const userId = request['user'].user_id;
    return this.chatService.userSearch(userId, query);
  }
}
