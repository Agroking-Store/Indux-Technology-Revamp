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

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to All Products
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="text-blue-700 font-bold mb-1">Status</h4>
                <p className="text-blue-900 font-medium">Production Ready</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-slate-700 font-bold mb-1">Category</h4>
                <p className="text-slate-900 font-medium">{project.category}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-10">
              {project.description}
            </p>

            <div className="mb-12">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Settings className="text-blue-600" /> Key Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm"
                  >
                    <CheckCircle2
                      className="text-emerald-500 shrink-0"
                      size={20}
                    />
                    <span className="font-medium text-slate-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <Activity size={32} className="text-blue-200" />
                <h3 className="text-2xl font-bold">Ready to implement?</h3>
              </div>
              <p className="text-blue-100 mb-8">
                Get a personalized demo of {project.title} and see how it fits
                your workflow.
              </p>
              <Link
                href="/contact-us"
                className="inline-block w-full text-center bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors"
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
