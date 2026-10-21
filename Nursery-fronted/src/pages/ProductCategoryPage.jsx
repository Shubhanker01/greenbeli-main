import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import PlantCard from "../components/PlantCard";
import { getProducts, getCategories } from "../utils/api";

export default function ProductCategoryPage() {
  const { slug, categoryName } = useParams();
  const targetCategory = slug || categoryName;

  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      const [cats, allProds] = await Promise.all([getCategories(), getProducts()]);
      
      const foundCat = cats.find(
        (c) => c.slug === targetCategory || c.name.toLowerCase() === targetCategory?.toLowerCase()
      );
      setCategoryInfo(foundCat || { name: targetCategory?.replace("-", " ") });

      const filtered = allProds.filter(
        (p) =>
          p.categorySlug === targetCategory ||
          p.category?.toLowerCase() === targetCategory?.replace("-", " ").toLowerCase()
      );
      setProducts(filtered.length > 0 ? filtered : allProds.slice(0, 4));
      setLoading(false);
    }
    loadCategoryData();
  }, [targetCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Plants
      </Link>

      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-3xl p-8 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="bg-emerald-800 text-emerald-200 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Botanical Collection
          </span>
          <h1 className="serif-font text-3xl sm:text-4xl font-bold capitalize">
            {categoryInfo?.name || targetCategory}
          </h1>
          <p className="text-emerald-200/80 text-xs sm:text-sm">
            {categoryInfo?.description || "Hand-selected varieties cultivated for healthy growth and living aesthetics."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-slate-100 rounded-3xl h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <PlantCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
