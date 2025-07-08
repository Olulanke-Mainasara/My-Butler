"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, User, Clock, Tag, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/Shad-UI/badge";
import { Button } from "@/components/Shad-UI/button";
import { Separator } from "@/components/Shad-UI/separator";

// Mock data - replace with actual data fetching
const mockArticle = {
  author: "Sarah Johnson",
  brand_id: "brand-123",
  content: `
    <p>The world of audio technology has evolved dramatically over the past decade, with wireless headphones leading the charge in innovation and user experience. As we move into 2024, the landscape continues to shift with new technologies and consumer demands.</p>
    
    <h2>The Rise of Adaptive Audio</h2>
    <p>One of the most significant developments in recent years has been the introduction of adaptive audio technology. This revolutionary approach allows headphones to automatically adjust their sound profile based on your environment, activity, and personal preferences.</p>
    
    <p>Unlike traditional noise cancellation, adaptive audio uses machine learning algorithms to understand your listening patterns and environmental context. Whether you're commuting on a busy train, working in a quiet office, or exercising at the gym, your headphones can now intelligently adapt to provide the optimal listening experience.</p>
    
    <h2>Sustainability in Audio Design</h2>
    <p>As consumers become increasingly environmentally conscious, audio manufacturers are responding with sustainable design practices. From recycled materials to modular designs that extend product lifespan, the industry is embracing eco-friendly innovation.</p>
    
    <p>Leading brands are now incorporating ocean plastic into their headphone construction, while others focus on creating products that can be easily repaired and upgraded rather than replaced. This shift represents a fundamental change in how we think about consumer electronics.</p>
    
    <h2>The Future of Spatial Audio</h2>
    <p>Spatial audio technology is transforming how we experience sound, creating immersive three-dimensional soundscapes that were previously only possible in professional studio environments. This technology is now becoming accessible to everyday consumers through advanced headphone designs.</p>
    
    <p>The implications extend beyond entertainment, with applications in virtual meetings, educational content, and therapeutic audio experiences. As this technology matures, we can expect to see even more innovative applications emerge.</p>
  `,
  created_at: "2024-01-18T14:30:00Z",
  description:
    "Explore the latest trends and innovations shaping the future of wireless audio technology, from adaptive sound to sustainable design practices.",
  display_image: "/placeholder.svg?height=600&width=1200",
  id: "article-123",
  slug: "future-of-wireless-audio-technology",
  tags: ["Technology", "Audio", "Innovation", "Wireless", "Future"],
  title: "The Future of Wireless Audio Technology: Trends to Watch in 2024",
  updated_at: "2024-01-19T10:15:00Z",
};

export default function ArticlePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={mockArticle.display_image || "/placeholder.svg"}
          alt={mockArticle.title}
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div
            className={`bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-12 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {mockArticle.tags?.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 hover:scale-105 cursor-pointer animate-in slide-in-from-left`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-in slide-in-from-left duration-700 delay-500">
              {mockArticle.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-in fade-in duration-700 delay-700">
              {mockArticle.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500 delay-900">
                  <User className="w-4 h-4" />
                  <span>By {mockArticle.author}</span>
                </div>
                <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500 delay-1000">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(
                      mockArticle.created_at || ""
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500 delay-1100">
                  <Clock className="w-4 h-4" />
                  <span>8 min read</span>
                </div>
              </div>

              <div className="flex items-center gap-2 animate-in slide-in-from-right duration-500 delay-1200">
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-300 hover:scale-105 ${
                    isBookmarked
                      ? "bg-blue-50 text-blue-600 border-blue-300"
                      : ""
                  }`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark
                    className={`w-4 h-4 transition-all duration-300 ${
                      isBookmarked ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div
            className={`bg-white rounded-3xl p-8 md:p-12 shadow-sm border transition-all duration-1000 delay-300 hover:shadow-md ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:transition-colors prose-h2:hover:text-blue-600"
              dangerouslySetInnerHTML={{ __html: mockArticle.content }}
            />

            <Separator className="my-12" />

            {/* Author Bio */}
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 hover:scale-110">
                {mockArticle.author?.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">
                  {mockArticle.author}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Technology journalist and audio enthusiast with over 10 years
                  of experience covering the latest innovations in consumer
                  electronics and audio technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
