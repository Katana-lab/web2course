export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.img} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.model}</p>
      <p className="price">{product.price} грн</p>
    </div>
  );
}
