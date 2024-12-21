import { Image } from "./Image";

type Outfit = {
  id: string;
  name: string;
  image: Image;
};

export type Brand = {
  id: string;
  name: string;
  lineup: Outfit[];
};
