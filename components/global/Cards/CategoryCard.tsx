import Link from "next/link";
import Image from "next/image";

// 🔹 تعریف type برای props
type CategoryCardProps = {
    id: number;
    image: string;
    link: string;
    title: string
};

export default function CategoryCard({ id, image, link, title }: CategoryCardProps) {
    return (
        <Link href={link}>
        <div className="py-0 my-2 w-full select-none">
            <div className="shadow-[0_0_10px_0px_rgba(187,139,80,0.2)] hover:shadow-[0_0_12px_0px_rgba(187,139,80,0.4)] relative shrink-0rounded-xl rounded-lg bg-primary-4 overflow-hidden transition-all duration-300 ease-in-out">
                <Image
                    src={image}
                    alt={`category-${id}`}
                    className="object-contain m-auto"
                    width={86}
                    height={86}
                />
            </div>
            <h6 className="my-3 text-center">{title}</h6>
        </div>
        </Link>
    );
}