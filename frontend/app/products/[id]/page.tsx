import { projects } from "@/lib/products-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Settings, Activity } from "lucide-react";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id.toString() === id);

  if (!project) notFound();

  // Helper to ensure leading slash for images
  const imageSrc = project.image.startsWith("http")
    ? project.image
    : project.image.startsWith("/")
      ? project.image
      : `/${project.image}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to All Products
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* <div className="space-y-8">
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl border border-transparent dark:border-slate-800">
              <Image
                src={imageSrc}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="text-blue-700 dark:text-blue-300 font-bold mb-1">
                  Status
                </h4>
                <p className="text-blue-900 dark:text-blue-100 font-medium">
                  Production Ready
                </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Category
                </h4>
                <p className="text-slate-900 dark:text-slate-100 font-medium">
                  {project.category}
                </p>
              </div>
            </div>
          </div> */}

          {/* Updated Hero Image section in products/[id]/page.tsx */}
          <div className="space-y-8">
            <div className="group relative aspect-video w-full overflow-hidden rounded-[2.5rem] border-4 border-slate-50 dark:border-slate-900 bg-slate-100 dark:bg-slate-900 shadow-2xl transition-all duration-500">
              {/* Decorative blur background - adds depth */}
              <div className="absolute -inset-4 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <Image
                src={imageSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
            </div>

            {/* Status & Category Cards with cleaner styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-hover hover:border-blue-200 dark:hover:border-blue-900">
                <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Status
                </h4>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-slate-900 dark:text-white font-bold">
                    Production Ready
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-hover hover:border-blue-200 dark:hover:border-blue-900">
                <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Category
                </h4>
                <p className="text-slate-900 dark:text-white font-bold">
                  {project.category}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white">
              {project.title}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
              {project.fullDescription}
            </p>

            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Settings className="text-blue-600 dark:text-blue-400" /> Key
                Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm"
                  >
                    <CheckCircle2
                      className="text-emerald-500 shrink-0"
                      size={20}
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Centered "Ready to implement?" Section --- */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl p-8 md:p-12 bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] text-white shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Activity size={40} className="text-blue-100" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to implement {project.title}?
              </h3>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl">
                Get a personalized demo of our solution and see how it fits your
                workflow. Our technical team is ready to assist your digital
                transformation journey.
              </p>
              <Link
                href="/contact-us"
                className="inline-block w-full sm:w-auto px-12 py-5 bg-white text-blue-600 dark:text-blue-700 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all hover:scale-105 shadow-lg cursor-pointer"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
