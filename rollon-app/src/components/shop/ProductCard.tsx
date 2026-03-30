import { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  }, [addItem, product]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (isWishlisted) {
      toast.info(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist`);
    }
  }, [toggleItem, product, isWishlisted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 transition-all duration-500 hover:border-primary/60 hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-3">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Gradient Overlay on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.new && (
                <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
              )}
              {product.salePrice && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  -{Math.round((1 - product.salePrice / product.price) * 100)}%
                </Badge>
              )}
              {product.featured && !product.new && !product.salePrice && (
                <Badge className="bg-primary hover:bg-primary/90">Featured</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background"
            >
              <motion.div
                animate={isWishlisted ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
              </motion.div>
            </button>

            {/* Quick Actions Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            >
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button size="icon" variant="secondary" asChild>
                <Link to={`/product/${product.slug}`} aria-label={`View ${product.name} details`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Name */}
            <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price with Smooth Transitions */}
            <div className="flex items-center gap-2">
              <motion.span
                className="text-lg font-bold text-primary"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                ৳{(product.salePrice || product.price).toLocaleString()}
              </motion.span>
              {product.salePrice && (
                <motion.span
                  className="text-sm text-muted-foreground line-through"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: isHovered ? 1 : 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  ৳{product.price.toLocaleString()}
                </motion.span>
              )}
            </div>

            {/* Stock Status */}
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-orange-500 mt-2">
                Only {product.stock} left!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-xs text-red-500 mt-2">Out of stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardComponent);
