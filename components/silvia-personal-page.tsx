import Image from 'next/image'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

const whatsAppLink = (message: string) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`

const products = [
  {
    category: 'Cuidado de la piel',
    title: 'Rutina hidratante',
    description: 'Una rutina simple para una piel fresca y suave.',
    image: '/product-skin.png',
    alt: 'Frasco de cuidado facial sin marca junto a hojas y una flor',
  },
  {
    category: 'Color',
    title: 'Labial tono rosa',
    description: 'Un toque de color cómodo para todos los días.',
    image: '/product-lip.png',
    alt: 'Labial rosa sin marca sobre una tela color crema',
  },
  {
    category: 'Mirada',
    title: 'Máscara de pestañas',
    description: 'Para sumar definición a tu look de siempre.',
    image: '/product-eye.png',
    alt: 'Máscara de pestañas y pincel de maquillaje sobre papel crema',
  },
  {
    category: 'Un mimo extra',
    title: 'Óleo nutritivo',
    description: 'Unas gotitas para completar tu momento de cuidado.',
    image: '/product-oil.png',
    alt: 'Frasco gotero de óleo facial sin marca con una flor rosada',
  },
]

function SiteHeader() {
  return (
    <header className="site-header page-width">
      <a aria-label="Silvia Garbarino, inicio" className="site-brand" href="#inicio">
        <span className="site-brand-name">Silvia Garbarino</span>
        <span className="site-brand-location">
          <MapPin aria-hidden="true" /> Young
        </span>
      </a>
      <a
        className="header-contact"
        href={whatsAppLink('Hola Silvia, ¿cómo estás?')}
        rel="noopener noreferrer"
        target="_blank"
      >
        Hablemos <ArrowUpRight aria-hidden="true" />
      </a>
    </header>
  )
}

function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="hero page-width" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          <Sparkles aria-hidden="true" /> Belleza para compartir
        </p>
        <h1 id="hero-title">
          Silvia <span>Garbarino</span>
        </h1>
        <p className="hero-role">Directora de ventas independiente en Young, Uruguay.</p>
        <p className="hero-description">
          Un espacio cercano para descubrir, aprender y disfrutar del cuidado a tu manera.
        </p>
        <a className="hero-link" href="#look-octubre">
          Conocé lo que hacemos <ArrowDown aria-hidden="true" />
        </a>
      </div>
      <div className="hero-visual">
        <div className="hero-photo-frame">
          <Image
            alt="Retrato ilustrativo de una mujer en una luz de primavera"
            className="hero-photo"
            height={1400}
            priority
            sizes="(max-width: 760px) 90vw, 42vw"
            src="/hero-silvia.png"
            width={1100}
          />
          <div className="hero-photo-caption">
            <span>Imagen ilustrativa</span>
            <span className="hero-caption-place">Young, Uruguay</span>
          </div>
        </div>
        <div aria-hidden="true" className="hero-seal">
          <span>un ratito</span>
          <strong>para vos</strong>
        </div>
      </div>
    </section>
  )
}

function SectionIntro({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string
  title: string
  description?: string
  id?: string
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  )
}

function LookSection() {
  return (
    <section aria-labelledby="look-title" className="content-section page-width" id="look-octubre">
      <SectionIntro eyebrow="Inspiración de temporada" id="look-title" title="Una invitación a probar algo nuevo" />
      <div className="look-card">
        <div className="look-copy">
          <p className="look-kicker">Look de octubre <span>·</span> Primavera 2026</p>
          <h3>La belleza se disfruta más cuando se comparte.</h3>
          <p>
          El catálogo de primavera reúne ideas de cuidado, color y pequeños rituales. Miralo con calma
          y contame qué te gustaría probar.
          </p>
          <a
            className="button button-primary"
            href="/look-primavera-octubre-2026.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            Ver el look <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="look-image-wrap">
          <Image
            alt="Maquillaje y flores de primavera sobre papel color crema"
            className="look-image"
            fill
            sizes="(max-width: 760px) 90vw, 38vw"
            src="/primavera-look.png"
          />
          <span className="look-image-note">Primavera · Octubre</span>
        </div>
      </div>
    </section>
  )
}

function ClassSection() {
  return (
    <section aria-labelledby="class-title" className="content-section page-width">
      <SectionIntro eyebrow="Nos encontramos" id="class-title" title="Próxima clase" />
      <div className="class-card">
        <div className="class-date" aria-label="Sábado 14 de noviembre">
          <span>SÁBADO</span>
          <strong>14</strong>
          <span>NOVIEMBRE</span>
        </div>
        <div className="class-copy">
          <p className="class-meta">
            <CalendarDays aria-hidden="true" /> Sábado 14 de noviembre · 16:00
          </p>
          <h3>Cuidado de la piel y automaquillaje</h3>
          <p>
            Una tarde para probar una rutina sencilla, aprender algunos trucos y compartir un rato
            lindo, sin apuro.
          </p>
          <div className="class-footer">
            <span className="class-location"><MapPin aria-hidden="true" /> Young, Río Negro</span>
            <a
              className="button button-primary"
              href={whatsAppLink('Hola Silvia, quiero coordinar para la próxima clase en Young.')}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" /> Coordinar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Image
          alt={product.alt}
          className="product-image"
          fill
          sizes="(max-width: 760px) 44vw, 24vw"
          src={product.image}
        />
      </div>
      <div className="product-copy">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <a
          aria-label={`Pedir por WhatsApp: ${product.title}`}
          className="product-link"
          href={whatsAppLink(`Hola Silvia, me gustaría saber más sobre ${product.title}.`)}
          rel="noopener noreferrer"
          target="_blank"
        >
          Pedir por WhatsApp <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

function ProductsSection() {
  return (
    <section aria-labelledby="products-title" className="content-section page-width" id="elegidos">
      <SectionIntro
        description="Un puñado de cosas que me gusta compartir. Si algo te llama, lo conversamos."
        eyebrow="Elegidos por mí"
        id="products-title"
        title="Para descubrir a tu ritmo"
      />
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product.title} product={product} />)}
      </div>
      <p className="browse-note">Solo para mirar y preguntar. Sin apuro, sin compromiso.</p>
    </section>
  )
}

function JoinSection() {
  return (
    <section aria-labelledby="join-title" className="join-section page-width">
      <div aria-hidden="true" className="join-sparkle"><Sparkles /></div>
      <div className="join-copy">
        <p className="eyebrow join-eyebrow">Una comunidad de mujeres</p>
        <h2 id="join-title">Sumarte al grupo</h2>
        <p>
          Si te gusta la belleza y te gustaría vender a tu manera, te cuento cómo es empezar con
          compañía y a tu propio ritmo.
        </p>
      </div>
      <a
        className="button button-light"
        href={whatsAppLink('Hola Silvia, quiero saber más sobre sumarme al grupo.')}
        rel="noopener noreferrer"
        target="_blank"
      >
        Quiero saber más <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  )
}

const articles = [
  {
    category: 'Historias que inspiran',
    title: 'Tu primer labial no fue el que te compraste',
    excerpt: 'A veces fue el que alguien te prestó, te mostró cómo usar y te animó a probar.',
    image: '/primavera-look.png',
    alt: 'Labial y flores de primavera en una composición cálida',
    readTime: '3 min de lectura',
  },
  {
    category: 'Cuidado real',
    title: 'Una rutina posible vale más que una rutina perfecta',
    excerpt: 'Cuidarte no tiene que ser complicado. Empezá por lo que te hace bien hoy.',
    image: '/product-skin.png',
    alt: 'Frasco de cuidado facial junto a hojas verdes',
    readTime: '2 min de lectura',
  },
]

function JournalSection() {
  return (
    <section aria-labelledby="journal-title" className="content-section page-width">
      <SectionIntro
        description="Ideas y pequeños recordatorios para llevarte algo lindo."
        eyebrow="Desde mi cuaderno"
        id="journal-title"
        title="Unas notas para vos"
      />
      <div className="journal-grid">
        {articles.map((article) => (
          <article className="journal-card" key={article.title}>
            <div className="journal-image-wrap">
              <Image
                alt={article.alt}
                className="journal-image"
                fill
                sizes="(max-width: 760px) 90vw, 42vw"
                src={article.image}
              />
            </div>
            <div className="journal-copy">
              <div className="journal-meta">
                <span>{article.category}</span>
                <span>{article.readTime}</span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <span aria-hidden="true" className="journal-arrow"><ArrowRight /></span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const saveSteps = [
  { number: '01', title: 'Tocá compartir', detail: 'Usá el botón de compartir de tu navegador.' },
  { number: '02', title: 'Agregala al inicio', detail: 'Elegí “Agregar a pantalla de inicio”.' },
  { number: '03', title: 'Listo, ya está', detail: 'Silvia queda cerquita, como una app.' },
]

function SaveSection() {
  return (
    <section aria-labelledby="save-title" className="save-section page-width">
      <div className="save-heading">
        <p className="eyebrow">Para tenerme a mano</p>
        <h2 id="save-title">Guardala en tu celular</h2>
        <p>Así volvés cuando quieras, en un toque.</p>
      </div>
      <ol className="save-steps">
        {saveSteps.map((step) => (
          <li className="save-step" key={step.number}>
            <span className="save-number">{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-width">
      <p className="footer-identity">
        <a className="footer-name" href="#inicio">Silvia Garbarino</a>
        <span aria-hidden="true">·</span>
        <span>Young, Río Negro</span>
      </p>
        <span className="footer-note">Belleza para compartir, a tu manera.</span>
      </div>
    </footer>
  )
}

export default function SilviaPersonalPage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main>
        <HeroSection />
        <LookSection />
        <ClassSection />
        <ProductsSection />
        <JoinSection />
        <JournalSection />
        <SaveSection />
      </main>
      <SiteFooter />
    </div>
  )
}
