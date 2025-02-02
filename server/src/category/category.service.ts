import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Categories } from 'src/database/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly CategoryModel: typeof Categories,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const oldCategory = await this.CategoryModel.findOne({
        where: { category_name: createCategoryDto.category_name },
      });
      console.log(oldCategory);
      if (oldCategory && oldCategory.dataValues)
        throw new ConflictException('Category already exists');

      await this.CategoryModel.create({
        category_name: createCategoryDto.category_name,
      });
      return 'Category Created Successfully';
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllCategories() {
    try {
      const allCategorys = await this.CategoryModel.findAll();
      return allCategorys;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCategory(category_id: string, newCategoryName: string) {
    try {
      console.log(category_id, newCategoryName);
      await this.CategoryModel.update(
        { category_name: newCategoryName },
        {
          where: {
            category_id: category_id,
          },
        },
      );
      return { message: 'Category updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
