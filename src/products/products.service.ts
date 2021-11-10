import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TProductDocument, Product } from '../schemas/product.model';
import { TUserDocument, User } from '../schemas/user.model';
import { ProductBodyDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<TProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
  ) {}

  async insertProduct(body: ProductBodyDto, user: TUserDocument) {
    const newProduct = await new this.productModel({
      ...body,
      owner: user,
    }).save();

    return { product: newProduct };
  }

  async getProducts() {
    const products = await this.productModel.find().populate('owner');
    return products.map((e) => e.view());
  }

  async getSingleProduct(productId: string) {
    const product = await this.productModel
      .findById(productId)
      .populate('owner');
    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    await updatedProduct.save();
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.getSingleProduct(id);
      product.remove();

    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(id: string): Promise<TProductDocument> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
