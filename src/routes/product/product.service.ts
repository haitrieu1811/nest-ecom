import { Injectable } from '@nestjs/common'

import { ProductRepo } from 'src/routes/product/product.repo'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}
}
