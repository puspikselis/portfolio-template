import OpengraphImage, {
  alt as ogAlt,
  contentType as ogContentType,
  size as ogSize,
} from "./opengraph-image";

export const alt = ogAlt;
export const contentType = ogContentType;
export const size = ogSize;

export default function TwitterImage() {
  return OpengraphImage();
}
