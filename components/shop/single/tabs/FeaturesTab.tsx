import { ScrollToFeaturesButton } from "./ScrollToFeaturesButton";

type Feature = { title: string; description: string }

type FeatureListProps = {
  features: Feature[]
  maxDisplay?: number
  showAll?: boolean
  showLink?: boolean
  gridCols?: {
    default?: string
    xl?: string
  }
}

export function FeaturesTab({
  features,
  maxDisplay = 4,
  showAll = true,
  showLink = false,
  gridCols = { default: "grid-cols-2", xl: "xl:grid-cols-3" }
}: FeatureListProps) {
  const displayFeatures = showAll ? features : features.slice(0, maxDisplay)
  const shouldShowLink = !showAll && features.length > maxDisplay && showLink

  return (
    <div className={`grid ${gridCols.default} ${gridCols.xl} gap-2`}>
      {displayFeatures.map((feature, i) => (
        <div
          key={i}
          className="flex items-center bg-primary-4 text-sm text-secondary-1 py-5 px-4 rounded-lg h-16"
        >
          {feature.title} : {feature.description}
        </div>
      ))}

      {shouldShowLink && <ScrollToFeaturesButton />}
    </div>
  )
}