import { Image } from "./Image";

export type Item = {
  _id: string | number;
  name: string;
  slug: string;
  displayImage: Image;
  description: string;
};
