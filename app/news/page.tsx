import NewsCard from "@/components/Shared/UI/Cards/NewsCard";
import { fashionBlogs } from "@/static-data/content";
import React from "react";

const News = () => {
  return (
    <div className="pt-4 md:pt-12">
      <h1 className="text-center text-4xl xl:text-8xl">New and Trendy</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 xl:gap-12 p-6 xl:p-12">
        {fashionBlogs.map((blog, index) => (
          <NewsCard key={blog._id} post={blog} index={index} />
        ))}
      </section>
    </div>
  );
};

export default News;
