import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  return (
    <div className="product-list">
      <div className="items">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
