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
  ValidationPipe
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { ApiTags,  ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ProductDto, ProductBodyDto} from './product.dto'

@ApiTags('products')
@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ description: "The Product has been successfully created" })
  @ApiResponse({
    description: "Add new Product",
    type: ProductDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "Unauthorized",
    status: HttpStatus.UNAUTHORIZED,
  })
  async addProduct(
    @Body() category: ProductBodyDto,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    const generatedId = await this.productsService.insertProduct(
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return { id: generatedId };
  }

  @Get()
  @ApiOperation({ description: "The Product has been successfully returned" })
  @ApiResponse({
    description: "Return all Products",
    type: [ ProductDto ],
    status: HttpStatus.OK,
  })
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  @ApiOperation({ description: "The Product has been successfully returned" })
  @ApiResponse({
    description: "Return single Product",
    type: ProductDto,
    status: HttpStatus.OK,
  })
  getProduct(@Param('id') prodId: string) {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  @ApiOperation({ description: "The Product has been successfully updated" })
  @ApiResponse({
    description: "Update Product",
    type: ProductDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "Unauthorized",
    status: HttpStatus.UNAUTHORIZED,
  })
  async updateProduct(
    @Body() category: ProductBodyDto,
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    return await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
  }

  @Delete(':id')
  @ApiOperation({ description: "The Product has been successfully deleted" })
  @ApiResponse({
    description: "Delete Product",
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "Unauthorized",
    status: HttpStatus.UNAUTHORIZED,
  })
  async removeProduct(@Param('id') prodId: string) {
      await this.productsService.deleteProduct(prodId);
      return null;
  }
}