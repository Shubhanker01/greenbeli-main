import {
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineTruck,
} from 'react-icons/hi2'
import { GiPlantSeed, GiFlowerPot, GiCactus, GiTreeBranch, GiGardeningShears } from 'react-icons/gi'

const offerItems = [
  {
    id: 1,
    title: 'Indoor Plants',
    description: 'Air-purifying and low-maintenance greens for home or office.',
    icon: GiPlantSeed,
  },
  {
    id: 2,
    title: 'Flower Plants',
    description: 'Color-rich flowering varieties curated for balconies or gifting.',
    icon: GiFlowerPot,
  },
  {
    id: 3,
    title: 'Succulents',
    description: 'Compact, modern texturing plants that demand minimal upkeep.',
    icon: GiCactus,
  },
  {
    id: 4,
    title: 'Outdoor Plants',
    description: 'Hardy foliage, shrubs, and trees for open terraces and gardens.',
    icon: GiTreeBranch,
  },
  {
    id: 5,
    title: 'Pots & Tools',
    description: 'Planters, soil mixes, and essential tools for healthy growth.',
    icon: GiGardeningShears,
  },
]

const chooseUsItems = [
  {
    id: 1,
    title: 'Healthy Roots',
    description: 'Nurtured with special care for root health and long-term vitality.',
    icon: HiOutlineSparkles,
  },
  {
    id: 2,
    title: 'Safe Transit',
    description: 'Secure protective packaging to prevent damage during shipping.',
    icon: HiOutlineTruck,
  },
  {
    id: 3,
    title: '100% Organic',
    description: 'Raised using organic feeds, soil mixes, and natural processes.',
    icon: GiPlantSeed,
  },
  {
    id: 4,
    title: 'Lifetime Support',
    description: 'Free plant-care guidance and ongoing support whenever needed.',
    icon: HiOutlineShieldCheck,
  },
]

function About() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Elegant Hero Banner */}
      <section className="relative overflow-hidden bg-emerald-950 px-4 py-16 text-white sm:px-6 md:py-24">
        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2f1d] via-[#103f29] to-[#1e583e] opacity-95" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="animate-fade-in-up">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                About Our Nursery
              </span>
              <h1 className="serif-title mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Nurturing Nature for Your Space
              </h1>
              <p className="mt-6 text-base leading-relaxed text-emerald-100/90 sm:text-lg">
                We believe in bringing healthy, organic plants directly from our greenhouse to your home. Our passion is helping you cultivate a green, fresh, and calming environment.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-2 text-xs font-semibold tracking-wider text-emerald-200">
                  100+ Varieties
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-2 text-xs font-semibold tracking-wider text-emerald-200">
                  Secure Delivery
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-2 text-xs font-semibold tracking-wider text-emerald-200">
                  Organic Soil
                </span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none animate-fade-in-up delay-100">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop"
                  alt="Greenhouse Plants"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Stats */}
      <section className="bg-white px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=1200&auto=format&fit=crop"
                  alt="Plants detail"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up delay-100">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-[2px] w-8 bg-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Our Story
                </span>
              </div>
              <h2 className="serif-title text-3xl font-bold text-emerald-950 sm:text-4xl">
                From Greenhouse to Your Doorstep
              </h2>
              <p className="mt-6 leading-relaxed text-slate-600">
                What began as a small passion project in 2018 has grown into a trusted nursery serving plant lovers nationwide. Every plant we grow receives individual attention, custom organic feeding, and precise care schedules.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                We design our packaging and shipping solutions so that your greens arrive fresh, active, and fully ready to fit into their new homes.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-100 bg-[#fcfdfe] p-5 shadow-sm">
                  <span className="text-3xl font-bold text-emerald-800">4,000+</span>
                  <p className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Healthy Plants
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-[#fcfdfe] p-5 shadow-sm">
                  <span className="text-3xl font-bold text-emerald-800">12,000+</span>
                  <p className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Happy Buyers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Grid */}
      <section className="bg-slate-100/50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 animate-fade-in-up text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Our Catalog
            </span>
            <h2 className="serif-title mt-2 text-3xl font-bold text-emerald-950 sm:text-4xl">
              Fresh Varieties & Nursery Essentials
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {offerItems.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md duration-300"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 animate-fade-in-up text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Why Us
            </span>
            <h2 className="serif-title mt-2 text-3xl font-bold text-emerald-950 sm:text-4xl">
              Quality Plant Care You Can Trust
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {chooseUsItems.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-emerald-50 bg-[#fafdf8] p-6 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="px-4 pb-16 sm:px-6 md:pb-24 bg-white">
        <div className="mx-auto max-w-[1000px] overflow-hidden rounded-2xl bg-emerald-950 px-6 py-12 text-white shadow-xl sm:px-12 md:py-16 relative">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-emerald-400/5 blur-[80px]" />

          <div className="relative text-center">
            <h2 className="serif-title text-3xl font-bold sm:text-4xl">
              Ready to Green Up Your Space?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-emerald-100/85 sm:text-base leading-relaxed">
              Explore our selection of indoor and outdoor plants, tools, and accessories. Start creating your own green corner today.
            </p>
            <div className="mt-8">
              <a
                href="/#products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50 active:scale-98"
              >
                Shop Plants
                <HiOutlineArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
