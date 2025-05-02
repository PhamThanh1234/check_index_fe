import Image from "next/image";
import Link from "next/link";

interface OptimizedImageProps {
  src: string;
  href?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string; // Class cho ảnh
  linkClassName?: string; // Class cho Link
  containerClassName?: string; // Class cho div bọc ngoài
  isExternal?: boolean; // Xác định link nội bộ hay ngoài
}

export default function OptimizedImage({
  src = "/images/logo-likepion.svg",
  href = "#",
  alt = "Image",
  priority = false,
  className = "",
  linkClassName = "",
  containerClassName = "",
  isExternal = false,
}: OptimizedImageProps) {
  const imageComponent = (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover w-full h-full ${className}`}
      quality={90}
      loading={priority ? "eager" : "lazy"}
      sizes="(max-width: 768px) 100vw, 170px"
      priority={priority}
    />
  );

  return (
    <div className={`relative ${containerClassName}`}>
      {isExternal ? (
        <a href={href} className={`block ${linkClassName}`} target="_blank" rel="noopener noreferrer">
          {imageComponent}
        </a>
      ) : (
        <Link href={href} className={`block ${linkClassName}`}>
          {imageComponent}
        </Link>
      )}
    </div>
  );
}

