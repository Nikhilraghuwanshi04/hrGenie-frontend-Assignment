import { AISidebar } from '@/components/organisms/AISidebar';
import { DocumentSidebar } from '@/components/organisms/DocumentSidebar';
import { Editor } from '@/components/organisms/Editor';
import { Navbar } from '@/components/organisms/Navbar';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <DocumentSidebar />
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-sm min-h-[calc(100vh-100px)] p-8">
              <Editor />
            </div>
          </div>
          <AISidebar />
        </main>
      </div>
    </div>
  );
}
