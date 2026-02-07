import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from './ShopContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute right-2 top-2">{product.category}</Badge>
        </div>
        <div className="p-4">
          <h3 className="text-lg">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full gap-2"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
