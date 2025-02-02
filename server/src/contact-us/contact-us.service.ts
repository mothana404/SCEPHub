import { Inject, Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { Contactus } from 'src/database/entities/contact-us.entity';

@Injectable()
export class ContactUsService {
  constructor(
    @Inject('CONTACTUS_REPOSITORY')
    private readonly ContactUsModel: typeof Contactus,
  ) {}

  async createContact(createContactUsDto: CreateContactUsDto) {
    try {
      await this.ContactUsModel.create({
        contact_name: createContactUsDto.contact_name,
        contact_email: createContactUsDto.contact_email,
        contact_phoneNumber: createContactUsDto.contact_phoneNumber,
        contact_message: createContactUsDto.contact_message,
      });
      return 'the content have been saved successfully!';
    } catch (error) {
      console.log(error);
    }
  }

  async allContactUs() {
    const allContacts = await this.ContactUsModel.findAll({
      order: [['createdAt', 'ASC']],
    });
    return allContacts;
  }

  async contactUsDetails(contactID: string) {
    const contactDetails = await this.ContactUsModel.findByPk(contactID);
    return contactDetails;
  }
}
