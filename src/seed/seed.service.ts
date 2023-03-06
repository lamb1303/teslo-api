import { initialData } from './data/seed-data';
import { ProductsService } from './../products/products.service';
import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    return await this.insertNewProducts();
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
