import type { CategoryItem } from "@/components/Header/categoriesMobile/types";


interface CategoryTabsProps {
    categories: CategoryItem[];
    activeCategoryId: number;
    onChange: (categoryId: number) => void;
}

export default function CategoryTabs({
    categories,
    activeCategoryId,
    onChange,
}: CategoryTabsProps) {
    return (
        <nav className="h-full overflow-y-auto">
            {categories.map((category) => {
                const isActive = category.id === activeCategoryId;

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onChange(category.id)}
                        className={`
                            relative flex w-full flex-col items-center justify-center
                            gap-2 border-b px-3 py-4 text-center text-xs
                            transition-colors duration-200
                            ${
                                isActive
                                    ? "bg-background font-semibold text-primary"
                                    : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                            }
                        `}
                    >
                        {/* نوار سمت راست دسته فعال */}
                        {isActive && (
                            <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-primary" />
                        )}

                        {/* عنوان */}
                        <span className="line-clamp-2 leading-5">
                            {category.title}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}