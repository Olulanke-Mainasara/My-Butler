"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Shad-UI/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shad-UI/dropdown-menu";
import { Button } from "@/components/Shad-UI/button";
import { MoreHorizontal, Pencil, Trash, Eye, PlusCircle } from "lucide-react";
import { Badge } from "@/components/Shad-UI/badge";
import Link from "next/link";
import Image from "next/image";

// Mock data
const products = [
  {
    id: 1,
    name: "Cotton T-Shirt",
    description: "Soft and breathable cotton t-shirt",
    category_id: 1,
    category_name: "T-Shirts",
    display_image: "/placeholder.svg?height=60&width=60",
    price: 29.99,
    stock_quantity: 150,
    rating: 4.5,
    reviews_count: 120,
    created_at: "2023-04-15T00:00:00Z",
    updated_at: "2023-07-20T00:00:00Z",
  },
  {
    id: 2,
    name: "Denim Jeans",
    description: "Classic denim jeans with a modern fit",
    category_id: 2,
    category_name: "Pants",
    display_image: "/placeholder.svg?height=60&width=60",
    price: 59.99,
    stock_quantity: 85,
    rating: 4.2,
    reviews_count: 95,
    created_at: "2023-05-10T00:00:00Z",
    updated_at: "2023-08-15T00:00:00Z",
  },
  {
    id: 3,
    name: "Graphic Hoodie",
    description: "Comfortable hoodie with unique graphic print",
    category_id: 3,
    category_name: "Hoodies",
    display_image: "/placeholder.svg?height=60&width=60",
    price: 49.99,
    stock_quantity: 120,
    rating: 4.7,
    reviews_count: 78,
    created_at: "2023-06-05T00:00:00Z",
    updated_at: "2023-09-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Canvas Sneakers",
    description: "Casual canvas sneakers for everyday wear",
    category_id: 4,
    category_name: "Footwear",
    display_image: "/placeholder.svg?height=60&width=60",
    price: 39.99,
    stock_quantity: 95,
    rating: 4.3,
    reviews_count: 65,
    created_at: "2023-07-20T00:00:00Z",
    updated_at: "2023-10-12T00:00:00Z",
  },
  {
    id: 5,
    name: "Slim Fit Blazer",
    description: "Tailored blazer for a professional look",
    category_id: 5,
    category_name: "Outerwear",
    display_image: "/placeholder.svg?height=60&width=60",
    price: 149.99,
    stock_quantity: 60,
    rating: 4.6,
    reviews_count: 85,
    created_at: "2023-08-15T00:00:00Z",
    updated_at: "2023-11-05T00:00:00Z",
  },
];

export default function Saved() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Saved</h1>
          <p className="text-neutral-400">View all your saved products.</p>
        </div>
        <Button asChild>
          <Link href="/shop" className="flex items-center">
            <PlusCircle />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.display_image || "/placeholder.svg"}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.stock_quantity > 50 ? "outline" : "destructive"
                    }
                  >
                    {product.stock_quantity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {product.rating}
                    <span className="ml-1 text-muted-foreground text-xs">
                      ({product.reviews_count})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link
                          href={`/dashboard/items/${product.id}`}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/dashboard/items/${product.id}/edit`}
                          className="flex items-center"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
