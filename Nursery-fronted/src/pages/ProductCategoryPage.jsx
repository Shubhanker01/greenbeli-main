import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";
import PlantCard from "../components/PlantCard";
import { getCategories, getProductsPaginated, resolveImageUrl } from "../utils/api";

const PAGE_SIZE = 100;

function getCategoryTitle(category, slug) {
  return (
    category?.name ||
    slug
      ?.split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") ||
    "Plant Collection"
  );
}

export default function ProductCategoryPage({ category }) {
  const { slug, categoryName } = useParams();
  const targetCategory = slug || category?.slug || categoryName;

  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategoryData() {
      setLoading(true);
      setLoadError("");
      try {
        const categories = await getCategories();
        const normalizedTarget = targetCategory?.trim().toLowerCase();
        const foundCategory = categories.find(
          (item) =>
            item.slug?.toLowerCase() === normalizedTarget ||
            item.name?.trim().toLowerCase() === normalizedTarget
        );
        const resolvedCategory = foundCategory || (
          category?.slug?.toLowerCase() === normalizedTarget ? category : null
        );

        if (cancelled) return;
        setCategoryInfo(resolvedCategory);

        if (!foundCategory?._id) {
          setProducts([]);
          return;
        }

        const firstPage = await getProductsPaginated({
          categoryId: foundCategory._id,
          page: 1,
          limit: PAGE_SIZE,
        });
        const pageCount = Math.ceil(firstPage.total / (firstPage.limit || PAGE_SIZE));
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
            getProductsPaginated({
              categoryId: foundCategory._id,
              page: index + 2,
              limit: PAGE_SIZE,
            })
          )
        );

        if (cancelled) return;
        setProducts([
          ...firstPage.items,
          ...remainingPages.flatMap((page) => page.items),
        ]);
      } catch (error) {
        if (cancelled) return;
        setLoadError(error.message || "Unable to load this category. Please try again.");
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategoryData();
    return () => {
      cancelled = true;
    };
  }, [targetCategory, category]);

  const categoryTitle = getCategoryTitle(categoryInfo || category, targetCategory);
  const categoryImage = categoryInfo?.imageUrl || categoryInfo?.coverImage;

  return (
    <div className="min-h-screen overflow-hidden bg-cream pb-20 text-slate-800 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4a34] transition hover:gap-3"
        >
          <ArrowLeft className="h-4 w-4" /> All plants
        </Link>

        <header className="mb-10 border-b border-stone-300/80 pb-8 sm:mb-14 sm:pb-10">
          <div className="grid grid-cols-1 items-end gap-8 sm:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1f4a34] sm:text-sm">
                <Leaf className="h-4 w-4" />
                Botanical collection
              </p>
              <h1 className="serif-font text-4xl font-medium leading-tight tracking-tight text-[#1f4a34] sm:text-5xl lg:text-6xl">
                {categoryTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
                {categoryInfo?.description ||
                  `Explore our ${categoryTitle.toLowerCase()} collection, selected to bring more life and greenery into your space.`}
              </p>
            </div>
            {categoryImage && (
              <img
                src={resolveImageUrl(categoryImage)}
                alt={`${categoryTitle} collection`}
                className="hidden h-36 w-52 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md object-cover shadow-md sm:block lg:h-44 lg:w-64"
              />
            )}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[8/9] rounded-md bg-stone-200/60" />
                <div className="mt-4 h-5 w-3/4 rounded bg-stone-200/60" />
                <div className="mt-2 h-4 w-1/2 rounded bg-stone-200/60" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="border-y border-rose-200 py-8 text-center text-sm text-rose-700"
          >
            {loadError}
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-stone-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {products.map((product) => (
                <PlantCard
                  key={product._id}
                  product={product}
                  variant="minimal"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="border-y border-stone-300/80 py-12 text-center">
            <p className="serif-font text-2xl font-semibold text-[#1f4a34]">
              {categoryInfo
                ? "This collection is growing."
                : "We couldn't find this collection."}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {categoryInfo
                ? "There are no products in this category just yet. Check back soon or browse all plants."
                : "Browse all plants to discover the full collection."}
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4a34] underline underline-offset-4"
            >
              Browse all plants <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
