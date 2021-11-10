import { Module } from '@nestjs/common';
import { CustomProductModule } from '../schemas/product.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CustomUserModule } from '../schemas/user.model';

@Module({
  imports: [
    CustomProductModule,
    CustomUserModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
