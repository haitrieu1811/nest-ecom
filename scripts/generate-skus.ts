import { SKUType, VariantsType } from 'src/shared/schemas/shared-product.schema'

const generateSKUs = (variants: VariantsType): Pick<SKUType, 'value' | 'price' | 'stock' | 'images'>[] => {
  if (variants.length === 0) return []

  const combine = (arrays: string[][]): string[][] => {
    return arrays.reduce<string[][]>(
      (acc, options) => acc.flatMap((combo) => options.map((option) => [...combo, option])),
      [[]],
    )
  }

  return combine(variants.map((v) => v.options)).map((combo) => ({
    value: combo.join('-'),
    price: 0,
    stock: 100,
    images: [],
  }))
}

const variants: VariantsType = [
  {
    value: 'Màu sắc',
    options: ['Trắng', 'Xanh'],
  },
]

const skus = generateSKUs(variants)
console.log(JSON.stringify(skus))
