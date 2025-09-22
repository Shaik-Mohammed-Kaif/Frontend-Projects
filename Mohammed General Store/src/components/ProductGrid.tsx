import { useState } from "react";
import { Filter, Grid, List, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { Product, categories } from "@/data/products";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart, onViewDetails }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = products.filter(product => 
    selectedCategory === "All" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "discount":
        return (b.discount_pct || 0) - (a.discount_pct || 0);
      default:
        return 0;
    }
  });

  return (
    <section className="py-16 px-4" id="products">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of quality products at unbeatable prices
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 glass-card">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 flex-1">
            <span className="flex items-center text-sm font-medium text-foreground mr-2">
              <Filter className="w-4 h-4 mr-1" />
              Categories:
            </span>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover-scale"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="discount">Best Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="rounded-r-none border-0"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="rounded-l-none border-0"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedProducts.length} products
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className={viewMode === "list" ? "max-w-none" : ""}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSortBy("default");
                }}
                className="btn-primary"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;