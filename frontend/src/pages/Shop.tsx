import { useEffect, useState } from 'react';
import { socialLinks } from '../lib/content';
import { apiGet } from '../lib/api';

type ShopProduct = {
  slug: string;
  name: string;
  author: string;
  description: string;
  image: string;
  price: string;
  category: 'book' | 'merch';
  link: string;
};

const DEFAULTS: ShopProduct[] = [
  {
    slug: 'finding-purpose',
    name: 'Finding Purpose (eBook)',
    author: 'Dr Shalom Oluwabusayo Mojere',
    description: 'A 7-day step-by-step guide to discovering purpose in pain. Practical, heartfelt, and written for every mother who has felt lost.',
    image: '/assets/images/finding-purpose-ebook.jpg',
    price: '£9.99',
    category: 'book',
    link: 'https://linktr.ee/purposeinpain1',
  },
  {
    slug: 'identity-hoodie',
    name: 'Identity Hoodie',
    author: '',
    description: 'Wear your identity with pride. Our signature PIP branded hoodie: comfortable, bold, and a reminder of who you truly are.',
    image: '/assets/images/value-identity-merch.jpg',
    price: 'Coming Soon',
    category: 'merch',
    link: '',
  },
];

export default function Shop() {
  const [products, setProducts] = useState<ShopProduct[]>(DEFAULTS);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (Array.isArray(d.shop?.products) && d.shop.products.length > 0) setProducts(d.shop.products); })
      .catch(() => {});
  }, []);

  const books = products.filter((p) => p.category === 'book');
  const merch = products.filter((p) => p.category === 'merch');

  function ProductCard({ item }: { item: ShopProduct }) {
    return (
      <div className="card flex flex-col overflow-hidden p-0">
        <img src={item.image} alt={item.name} className="aspect-[3/4] w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
            {item.category === 'book' ? 'Book' : 'Merchandise'}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-navy-700">{item.name}</h3>
          {item.author && <p className="mt-1 text-sm text-navy-700/60">{item.author}</p>}
          <p className="mt-3 flex-1 text-sm text-navy-700/80">{item.description}</p>
          {item.price && (
            <p className="mt-4 font-display text-xl font-bold text-navy-700">{item.price}</p>
          )}
          {item.link ? (
            <a href={item.link} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full text-center">
              {item.category === 'book' ? 'Get the Book' : 'Order Now'}
            </a>
          ) : (
            <button disabled className="btn-primary mt-4 w-full cursor-not-allowed opacity-50">
              Coming Soon
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Shop</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Books, merchandise, and resources that carry the mission. Every purchase supports our programs for
            postpartum mothers.
          </p>
        </div>
      </section>

      {books.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <h2 className="section-heading">Books & Resources</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((item) => <ProductCard key={item.slug} item={item} />)}
          </div>
        </section>
      )}

      {merch.length > 0 && (
        <section className="bg-sky-50/60 py-16 sm:py-20">
          <div className="container-page">
            <h2 className="section-heading">Merchandise</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {merch.map((item) => <ProductCard key={item.slug} item={item} />)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-bold">Want to be notified when new items drop?</h2>
          <p className="max-w-lg text-white/80">Join our community to get early access and updates.</p>
          <a href={socialLinks.community} target="_blank" rel="noreferrer" className="btn-primary">
            Join the Community
          </a>
        </div>
      </section>
    </div>
  );
}
