'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileQuestionIcon } from 'lucide-react';

export default function NotFound() {
  const { locale } = useParams();
  
  return (
    <div className="container flex h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <FileQuestionIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mb-4 text-4xl font-bold">Article Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The article you are looking for does not exist or has been removed. Please return to the blog homepage to browse other articles.
      </p>
      <Button asChild>
        <Link href={`/${locale}/blog`}>Back to Blog Homepage</Link>
      </Button>
    </div>
  );
} 