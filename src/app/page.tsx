import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Hero3D } from "@/components/layout/hero-3d"
import { PropertyCard3D } from "@/components/properties/property-card-3d"
import { ShieldCheck, Award, Sparkles, MapPin, BedDouble, Bath, Square, Calendar, ArrowRight } from "lucide-react"
import { getProperties } from "@/actions/properties"
import { getBlogPosts } from "@/actions/blog"
import dynamic from "next/dynamic"

const ContactCTA = dynamic(
  () => import("@/components/layout/contact-cta").then((mod) => mod.ContactCTA),
  {
    ssr: true,
  }
)


export const metadata = {
  title: "RealityPro | Legacy Estates & Luxury Real Estate",
  description: "Explore a curated portfolio of private islands, glass penthouses, and bespoke architectural landmarks globally.",
}

export const revalidate = 3600 // static pre-render with 1 hour ISR

export default async function Home() {
  // Fetch featured properties and blog posts in parallel
  const [propertiesResult, allBlogPosts] = await Promise.all([
    getProperties({ isFeatured: true, pageSize: 4 }),
    getBlogPosts()
  ])

  let { properties } = propertiesResult
  
  // If no featured properties exist, fallback to the latest active listings
  if (properties.length === 0) {
    const fallbackRes = await getProperties({ pageSize: 4 })
    properties = fallbackRes.properties
  }

  const activeBlogPosts = allBlogPosts.slice(0, 3)

  // Format price helper
  const formatPrice = (price: number, purpose: "buy" | "rent") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
    return purpose === "rent" ? `${formatted}/mo` : formatted
  }

  // Pick first property as the "Featured Estate" and the rest for the grid
  const featuredEstate = properties[0]
  const listProperties = properties.slice(1, 4)

  // Fallback placeholder images if no images exist in DB
  const defaultEstateImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=75"
  
  const featuredEstateImg = featuredEstate?.property_images?.find((img: any) => img.is_primary)?.url || 
                            featuredEstate?.property_images?.[0]?.url || 
                            defaultEstateImage

  return (
    <div className="flex flex-col bg-background min-h-screen text-foreground overflow-hidden">
      {/* 3D Interactive Hero Section */}
      <Hero3D />

      {/* ================= SECTION 1: FEATURED ESTATE ================= */}
      {featuredEstate && (
        <section className="container mx-auto px-4 md:px-8 py-20 border-b border-border/40">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-block text-[10px] font-sans font-medium bg-secondary text-primary dark:bg-primary/40 dark:text-accent border border-accent/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Monthly Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-foreground">
              The Featured Estate
            </h2>
            <div className="h-0.5 w-12 bg-accent mx-auto" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center bg-card rounded-3xl overflow-hidden border border-border/50 shadow-xl">
            {/* Left large visual (80% visual aspect) */}
            <div className="lg:col-span-7 aspect-[16/10] relative overflow-hidden group">
              <Image 
                src={featuredEstateImg} 
                alt={featuredEstate.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-xs uppercase tracking-wider font-semibold">
                Signature Portfolio
              </div>
            </div>

            {/* Right editorial info */}
            <div className="lg:col-span-5 p-8 lg:p-12 space-y-6">
              <div className="space-y-2">
                <span className="text-accent text-xs font-mono tracking-widest uppercase block">
                  {featuredEstate.city}, {featuredEstate.state}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-light text-foreground leading-tight">
                  {featuredEstate.title}
                </h3>
              </div>

              <p className="text-muted-foreground font-sans font-light text-sm md:text-base leading-relaxed line-clamp-4">
                {featuredEstate.description || "An architectural masterpiece offering a harmonious blend of refined design, premium natural materials, and an unparalleled standard of private luxury living."}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-border/50 py-4 font-sans font-light text-xs text-muted-foreground">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Bedrooms</span>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-accent" /> {featuredEstate.bedrooms || 0} Beds
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Bathrooms</span>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-accent" /> {featuredEstate.bathrooms || 0} Baths
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Living Area</span>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Square className="h-4 w-4 text-accent" /> {featuredEstate.area_sqft || 0} sqft
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Valuation</span>
                  <div className="text-2xl font-serif font-medium text-accent">
                    {formatPrice(featuredEstate.price, featuredEstate.purpose)}
                  </div>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium rounded-xl group px-6">
                  <Link href={`/properties/${featuredEstate.slug}`}>
                    Explore Estate
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SECTION 2: CURATED PROPERTIES GRID ================= */}
      <section className="container mx-auto px-4 md:px-8 py-20 border-b border-border/40">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2 text-left">
            <span className="inline-block text-[10px] font-sans font-medium bg-secondary text-primary dark:bg-primary/40 dark:text-accent border border-accent/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Exclusive Access
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground">
              Featured Properties
            </h2>
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-muted rounded-xl" asChild>
            <Link href="/buy" className="flex items-center gap-1">
              Explore All Listings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {listProperties.map((property, idx) => {
            const propertyItem = {
              id: property.id,
              title: property.title,
              price: formatPrice(property.price, property.purpose),
              address: `${property.address}, ${property.city}, ${property.state}`,
              bedrooms: property.bedrooms || 0,
              bathrooms: property.bathrooms || 0,
              area_sqft: property.area_sqft || 0,
              type: property.type,
              purpose: property.purpose,
              imageIndex: (idx % 5) + 2, // offset to vary placeholders
              slug: property.slug,
              imageUrl: property.property_images?.find((img: any) => img.is_primary)?.url || property.property_images?.[0]?.url
            }
            return (
              <PropertyCard3D key={property.id} property={propertyItem} />
            )
          })}
        </div>
      </section>

      {/* ================= SECTION 3: WHY CHOOSE US ================= */}
      <section className="container mx-auto px-4 md:px-8 py-20 border-b border-border/40">
        <div className="text-center space-y-3 mb-16">
          <span className="inline-block text-[10px] font-sans font-medium bg-secondary text-primary dark:bg-primary/40 dark:text-accent border border-accent/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            Our Brand Philosophy
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-foreground">
            Distinction In Every Detail
          </h2>
          <div className="h-0.5 w-12 bg-accent mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="space-y-4 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
            <span className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Award className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-serif font-medium text-foreground">Curated Portfolios</h3>
            <p className="text-muted-foreground text-sm font-sans font-light leading-relaxed">
              We vet and select only the top 0.1% of global architectural estates, ensuring significant heritage and material perfection.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-4 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
            <span className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-serif font-medium text-foreground">Bespoke Advisory</h3>
            <p className="text-muted-foreground text-sm font-sans font-light leading-relaxed">
              Our consultants offer tailored advisory covering everything from architectural styling to structural preservation and wealth sync.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-4 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
            <span className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-serif font-medium text-foreground">Absolute Discretion</h3>
            <p className="text-muted-foreground text-sm font-sans font-light leading-relaxed">
              Serving private collectors and royal families globally, we conduct transactions with the highest level of confidentiality.
            </p>
          </div>

          {/* Card 4 */}
          <div className="space-y-4 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
            <span className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Calendar className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-serif font-medium text-foreground">Architectural Significance</h3>
            <p className="text-muted-foreground text-sm font-sans font-light leading-relaxed">
              Every home we represent is an architectural statement, featuring curated geometries, premium glazing, and environmental harmony.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: LUXURY COMMUNITIES ================= */}
      <section className="container mx-auto px-4 md:px-8 py-20 border-b border-border/40">
        <div className="text-center space-y-3 mb-16">
          <span className="inline-block text-[10px] font-sans font-medium bg-secondary text-primary dark:bg-primary/40 dark:text-accent border border-accent/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            Signature Locations
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-foreground">
            Luxury Communities
          </h2>
          <div className="h-0.5 w-12 bg-accent mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Community 1 */}
          <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=70" 
              alt="Beverly Hills"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="text-xl font-serif font-light">Beverly Hills</h3>
              <p className="text-xs text-white/70 font-sans font-light">Private hillside sanctuaries & mid-century landmarks.</p>
            </div>
          </div>

          {/* Community 2 */}
          <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=70" 
              alt="Palm Jumeirah"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="text-xl font-serif font-light">Palm Jumeirah</h3>
              <p className="text-xs text-white/70 font-sans font-light">Ultra-modern beach villas & panoramic waters.</p>
            </div>
          </div>

          {/* Community 3 */}
          <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=70" 
              alt="Kyoto Zen"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="text-xl font-serif font-light">Kyoto Pavilions</h3>
              <p className="text-xs text-white/70 font-sans font-light">Timber masterpieces, gardens, and tranquil water pools.</p>
            </div>
          </div>

          {/* Community 4 */}
          <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=400&q=70" 
              alt="Swiss Alps"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="text-xl font-serif font-light">Swiss Alps</h3>
              <p className="text-xs text-white/70 font-sans font-light">High timber chalets & exclusive winter retreats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: TESTIMONIALS ================= */}
      <section className="container mx-auto px-4 md:px-8 py-20 border-b border-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block text-[10px] font-sans font-medium bg-secondary text-primary dark:bg-primary/40 dark:text-accent border border-accent/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            Discerning Voices
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground">
            Client Testimonials
          </h2>
          <div className="h-0.5 w-12 bg-accent mx-auto" />
          
          <div className="space-y-6 py-6">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed font-light">
              &ldquo;RealtyPro didn&apos;t just locate a house; they curated an experience of architectural excellence that perfectly matched our life&apos;s cadence. Their advisory is unmatched.&rdquo;
            </blockquote>
            <div className="space-y-1">
              <cite className="not-italic text-sm uppercase tracking-widest font-semibold text-foreground">Sir Arthur Sterling</cite>
              <p className="text-xs text-muted-foreground font-sans font-light">London &amp; Beverly Hills Client</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: JOURNAL (BLOG) ================= */}
      <section className="container mx-auto px-4 md:px-8 py-20 border-b border-border/40">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2 text-left">
            <span className="inline-block text-[10px] font-sans font-medium bg-secondary text-primary dark:bg-primary/40 dark:text-accent border border-accent/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Architectural Press
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground">
              The Journal
            </h2>
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-muted rounded-xl" asChild>
            <Link href="/blog" className="flex items-center gap-1">
              Read Editorial Journal
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {activeBlogPosts.length > 0 ? (
            activeBlogPosts.map((post: any) => (
              <article key={post.id} className="group space-y-4">
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-muted border border-border/50 relative shadow-sm">
                  <Image
                    src={post.featured_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-accent uppercase tracking-wider">
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>•</span>
                    <span>Editorial</span>
                  </div>
                  <h3 className="text-xl font-serif font-light text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans font-light line-clamp-2 leading-relaxed">
                    {post.meta_description || "Explore our latest perspective on fine architecture, interior materials, and global real estate developments."}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-accent group-hover:text-primary dark:group-hover:text-accent-foreground flex items-center gap-1.5 pt-1">
                    Read Editorial
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            // Mock Journal Post fallback if database is empty
            [1, 2, 3].map((postIdx) => (
              <article key={postIdx} className="group space-y-4">
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-muted border border-border/50 relative shadow-sm">
                  <Image
                    src={[
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80"
                    ][postIdx - 1]}
                    alt="Journal Post Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-accent uppercase tracking-wider">
                    <span>June {15 + postIdx}, 2026</span>
                    <span>•</span>
                    <span>Architecture</span>
                  </div>
                  <h3 className="text-xl font-serif font-light text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {[
                      "The Geometry of Light: Defining Modern Hillside Estates",
                      "Sustainable Timber: Crafting the Pavilions of Kyoto Zen",
                      "Raw Concrete & Smart Glazing: The Future of Urban Penthouses"
                    ][postIdx - 1]}
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans font-light line-clamp-2 leading-relaxed">
                    {[
                      "How contemporary designers are using smart glass and natural light alignment to redefine private living spaces.",
                      "A closer look at Kyoto timber craftsmanship and its integration into contemporary luxury real estate layouts.",
                      "Examines the industrial design trends bringing raw textures and custom framing into the world's most elite skylines."
                    ][postIdx - 1]}
                  </p>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1.5 pt-1 cursor-pointer">
                    Read Editorial
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* ================= SECTION 7: BESPOKE CONTACT CTA ================= */}
      <ContactCTA />
    </div>
  )
}
