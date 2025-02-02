import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role/role.enum';

@ApiTags('ContactUs APIs')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @ApiResponse({ status: 201 })
  @Post()
  async createContact(@Body() createContactUsDto: CreateContactUsDto) {
    return await this.contactUsService.createContact(createContactUsDto);
  }

  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 401, description: 'not have an access to it' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async allContactUs() {
    return await this.contactUsService.allContactUs();
  }

  @ApiResponse({ status: 201, description: 'contain details' })
  @ApiResponse({ status: 401, description: 'not have an access to it' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async contactUsDetails(@Param('id') id: string) {
    return await this.contactUsService.contactUsDetails(id);
  }
}
