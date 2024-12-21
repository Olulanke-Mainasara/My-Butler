import { Blog } from "@/types/Blog";
import { Item } from "@/types/Item";
import BlogImage from "@/public/BlogImage.jpg";

export const fashionBlogs: Blog[] = [
  {
    _id: 1,
    title: "Embracing Sustainable Fashion",
    slug: "embracing-sustainable-fashion",
    image: {
      url: BlogImage,
      alt: "Woman wearing a recycled fabric dress in a natural setting",
    },
    description:
      "Discover how sustainable fashion is revolutionizing the industry, with eco-friendly materials, ethical production, and a commitment to reducing waste.",
    content: [
      "Sustainable fashion is more than a trend; it’s a movement. With environmental consciousness on the rise, designers and brands are adopting practices that prioritize the planet.",
      "This season, look out for organic cotton, recycled polyester, and plant-based dyes. Not only do they reduce environmental impact, but they also bring fresh, innovative looks to the runway.",
    ],
  },
  {
    _id: 2,
    title: "Bold Colors and Patterns for Fall",
    slug: "bold-colors-patterns-fall",
    image: {
      url: BlogImage,
      alt: "Model in a colorful patterned coat and vibrant background",
    },
    description:
      "Get ready to stand out with bold colors and patterns. This fall, designers are showcasing statement pieces that bring life to the season’s muted palette.",
    content: [
      "Bright oranges, deep blues, and striking purples are making waves this season. Fashion enthusiasts are encouraged to mix patterns and colors for a dynamic look.",
      "Pair a patterned coat with solid-colored accessories to balance the look, or go all-in with contrasting textures for a bolder statement.",
    ],
  },
  {
    _id: 3,
    title: "The Rise of Streetwear Elegance",
    slug: "rise-of-streetwear-elegance",
    image: {
      url: BlogImage,
      alt: "Man in a tailored streetwear outfit with urban background",
    },
    description:
      "Streetwear is evolving into a refined, elegant style. This blog explores how high-end tailoring meets casual urban fashion.",
    content: [
      "Streetwear has moved beyond hoodies and oversized tees, integrating tailored blazers, fitted pants, and luxe materials into its aesthetic.",
      "With a focus on quality, modern streetwear combines comfort and style, making it ideal for both casual and semi-formal settings.",
    ],
  },
  {
    _id: 4,
    title: "Timeless Black and White Combinations",
    slug: "timeless-black-white",
    image: {
      url: BlogImage,
      alt: "Person in a classic black and white outfit in an urban setting",
    },
    description:
      "Black and white fashion never goes out of style. Learn how to perfect the monochrome look and add sophistication to your wardrobe.",
    content: [
      "Classic black and white outfits bring a sense of elegance and simplicity. Whether it’s a black blazer over a white dress or a two-tone ensemble, monochrome is timeless.",
      "Experiment with textures and silhouettes to keep the look fresh, and consider adding silver or gold accessories for added flair.",
    ],
  },
];

export const fashionItems: Item[] = [
  {
    _id: 1,
    name: "Oversized Blazer",
    slug: "oversized-blazer",
    displayImage: {
      url: BlogImage,
      alt: "Woman wearing a stylish oversized blazer with a casual outfit",
    },
    description:
      "A staple in modern wardrobes, this oversized blazer combines structure with comfort. Perfect for layering over both casual and formal outfits, it adds an effortlessly chic touch.",
  },
  {
    _id: 2,
    name: "Chunky Gold Chain Necklace",
    slug: "chunky-gold-chain-necklace",
    displayImage: {
      url: BlogImage,
      alt: "Close-up of a chunky gold chain necklace on a mannequin",
    },
    description:
      "Make a bold statement with this chunky gold chain necklace. Whether layered with other accessories or worn alone, it adds a touch of luxury and sophistication to any outfit.",
  },
  {
    _id: 3,
    name: "Retro Square Sunglasses",
    slug: "retro-square-sunglasses",
    displayImage: {
      url: BlogImage,
      alt: "Model wearing retro square sunglasses with a stylish outfit",
    },
    description:
      "These retro square sunglasses are a must-have accessory this season. With their unique shape and UV protection, they blend style with functionality, perfect for sunny days.",
  },
  {
    _id: 4,
    name: "High-Waisted Wide-Leg Pants",
    slug: "high-waisted-wide-leg-pants",
    displayImage: {
      url: BlogImage,
      alt: "High-waisted wide-leg pants paired with a crop top and heels",
    },
    description:
      "High-waisted wide-leg pants bring a relaxed yet elegant silhouette. Perfect for both work and casual outings, they offer comfort while remaining fashion-forward.",
  },
  {
    _id: 5,
    name: "Platform Loafers",
    slug: "platform-loafers",
    displayImage: {
      url: BlogImage,
      alt: "Pair of black platform loafers with a sleek design",
    },
    description:
      "Elevate your style with these platform loafers. Combining the classic loafer design with a modern twist, they add both height and a unique edge to any look.",
  },
  {
    _id: 6,
    name: "Statement Ring Set",
    slug: "statement-ring-set",
    displayImage: {
      url: BlogImage,
      alt: "Set of silver statement rings with various designs",
    },
    description:
      "This set of statement rings is perfect for adding a personalized touch to your style. Featuring various designs and sizes, they bring a contemporary vibe to any look.",
  },
];
