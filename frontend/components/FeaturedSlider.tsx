import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Product } from './ShopContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedSliderProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function FeaturedSlider({ products, onAddToCart }: FeaturedSliderProps) {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="w-full px-4">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {featuredProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="mb-2">{product.name}</h3>
                      <p className="mb-4 text-sm text-gray-200">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">${product.price.toFixed(2)}</span>
                        <Button
                          onClick={() => onAddToCart(product)}
                          variant="secondary"
                          size="sm"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
