import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <h1 className="text-4xl font-bold mb-6">Careers</h1>
      <p className="max-w-2xl text-lg text-center mb-8">
        Join our amazing team! We are always looking for talented individuals to help us build the future.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
