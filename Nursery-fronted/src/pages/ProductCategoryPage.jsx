import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";
import PlantCard from "../components/PlantCard";
import { Reveal, RevealGroup } from "../components/Reveal"; // adjust path if needed
import { getCategories, getProductsPaginated, resolveImageUrl } from "../utils/api";

const PAGE_SIZE = 100;
const GREEN = "#1f4a34";

const GRID =
  "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4";

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

  const info = categoryInfo || category;
  const categoryTitle = getCategoryTitle(info, targetCategory);
  // `image` is the field the homepage category cards use, so it is checked as well
  const categoryImage = info?.imageUrl || info?.coverImage || info?.image;
  const countLabel = `${products.length} ${products.length === 1 ? "plant" : "plants"}`;

  return (
    <div className="min-h-screen overflow-hidden bg-cream pb-20 text-slate-800 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4a34] transition hover:gap-3"
        >
          <ArrowLeft className="h-4 w-4" /> All plants
        </Link>

        {/* Heading first: eyebrow, big title, short description */}
        <Reveal className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-14">
          <div className="space-y-3 sm:space-y-4">
            <p
              style={{ color: GREEN }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              <Leaf className="h-4 w-4" />
              Botanical collection
            </p>
            <h1
              style={{ color: GREEN }}
              className="serif-font text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {categoryTitle}
            </h1>
          </div>

          <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            {info?.description ||
              `Explore our ${categoryTitle.toLowerCase()} collection, selected to bring more life and greenery into your space.`}
          </p>
        </Reveal>

        {/* Big banner image (same arched corner as the homepage hero) */}
        {loading ? (
          <div className="mt-8 h-64 animate-pulse rounded-tl-[5rem] rounded-tr-md rounded-b-md bg-emerald-100/60 sm:mt-10 sm:h-96 sm:rounded-tl-[9rem] lg:h-[30rem] lg:rounded-tl-[12rem]" />
        ) : (
          categoryImage && (
            <Reveal effect="rise" className="mt-8 sm:mt-10">
              <div className="group relative h-64 overflow-hidden rounded-tl-[5rem] rounded-tr-md rounded-b-md bg-emerald-100/60 shadow-xl shadow-emerald-950/10 sm:h-96 sm:rounded-tl-[9rem] lg:h-[30rem] lg:rounded-tl-[12rem]">
                <img
                  src={resolveImageUrl(categoryImage)}
                  alt={`${categoryTitle} collection`}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent"
                />
                {products.length > 0 && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#1f4a34] shadow-md backdrop-blur-sm sm:bottom-6 sm:left-6">
                    {countLabel} in this collection
                  </span>
                )}
              </div>
            </Reveal>
          )
        )}

        {/* Products */}
        <div className="mt-12 sm:mt-16">
          {loading ? (
            <div className={GRID}>
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
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-stone-300/80 pb-4 sm:mb-8">
                <h2
                  style={{ color: GREEN }}
                  className="serif-font text-2xl font-semibold sm:text-3xl"
                >
                  Shop the collection
                </h2>
                <span className="text-sm text-stone-500">{countLabel}</span>
              </div>

              <RevealGroup stagger={0.07} className={GRID}>
                {products.map((product) => (
                  <Reveal key={product._id} effect="card" className="h-full">
                    <PlantCard product={product} variant="minimal" />
                  </Reveal>
                ))}
              </RevealGroup>
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
    </div>
  );
}