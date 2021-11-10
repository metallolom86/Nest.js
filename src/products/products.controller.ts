import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductDto, ProductBodyDto } from './product.dto';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { TUserDocument } from '../schemas/user.model';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';

@ApiTags('products')
@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ description: 'The Product has been successfully created' })
  @ApiResponse({
    description: 'Add new Product',
    type: ProductDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  })
  @UseGuards(JwtAuthGuard)
  async addProduct(
    @Body() body: ProductBodyDto,
    @GetUser() user: TUserDocument,
  ) {
    const result = await this.productsService.insertProduct(body, user);
    return result;
  }

  @Get()
  @ApiOperation({ description: 'The Product has been successfully returned' })
  @ApiResponse({
    description: 'Return all Products',
    type: [ProductDto],
    status: HttpStatus.OK,
  })
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  @ApiOperation({ description: 'The Product has been successfully returned' })
  @ApiResponse({
    description: 'Return single Product',
    type: ProductDto,
    status: HttpStatus.OK,
  })
  getProduct(@Param('id') prodId: string) {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  @ApiOperation({ description: 'The Product has been successfully updated' })
  @ApiResponse({
    description: 'Update Product',
    type: ProductDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  })
  async updateProduct(
    @Body() category: ProductBodyDto,
    @Param('id') id: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    return await this.productsService.updateProduct(
      id,
      prodTitle,
      prodDesc,
      prodPrice,
    );
  }

  @Delete(':id')
  @ApiOperation({ description: 'The Product has been successfully deleted' })
  @ApiResponse({
    description: 'Delete Product',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  })
  @UseGuards(JwtAuthGuard)
  async removeProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return { id };
  }
}
