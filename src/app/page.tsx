import VideoGrid from '@/app/components/VideoGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 px-4">
            Trending Videos
          </h1>
          <VideoGrid />
        </div>
      </div>
    </main>
  );
}
