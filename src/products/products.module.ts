import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { CustomProductModule } from './product.model'
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
// import { ProductSchema } from './product.model';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    CustomProductModule
  ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}