'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, JournalEntry, ArchiveItem, Collection } from '@/lib/types';
import ProductCard from '../components/ProductCard';
import SearchModal from '../components/SearchModal';

export default function Home() {
  const mapSvgRef = useRef<SVGSVGElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch Supabase data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [pdRes, jdRes, adRes, cdRes] = await Promise.all([
          supabase
            .from('products')
            .select('*, colors:product_colors(*)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(4),
          supabase
            .from('journal_entries')
            .select('*')
            .eq('is_published', true)
            .order('date', { ascending: false })
            .limit(3),
          supabase
            .from('archive_items')
            .select('*')
            .order('order_index')
            .limit(6),
          supabase
            .from('collections')
            .select('*')
            .eq('is_active', true)
            .order('order_index')
            .limit(3)
        ]);

        if (!isMounted) return;

        if (pdRes.data) setProducts(pdRes.data);
        if (jdRes.data) setJournals(jdRes.data);
        if (adRes.data) setArchives(adRes.data);
        if (cdRes.data) setCollections(cdRes.data);
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Intersection Observer for Reveal Elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('opacity-100', 'translate-y-0');
            e.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [products, journals, archives, collections, isLoading]);

  // Parallax Map Scroll
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (mapSvgRef.current && y < window.innerHeight * 1.2) {
          mapSvgRef.current.style.transform = `translateY(${y * 0.035}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main id="top" className="bg-[#f5f2ea] text-[#151515] min-h-screen">
      {/* 01 / HERO MAP SECTION */}
      <section className="min-h-screen pt-12 pb-12 px-[2vw] flex items-center justify-center relative overflow-hidden select-none" id="map">
        <div className="w-full max-w-[1400px] aspect-[16/8.5] min-h-[500px] relative flex items-center justify-center">

          {/* Precision Scaled Canvas System */}
          <svg
            ref={mapSvgRef}
            className="w-full h-full object-contain pointer-events-none"
            viewBox="0 0 1200 650"
            fill="none"
            aria-hidden="true"
          >
            {/* 1. Grid Lines & Bisectors */}
            <g stroke="#151515" strokeWidth="0.5" strokeOpacity="0.22">
              <line x1="380" y1="50" x2="380" y2="600" />
              <line x1="490" y1="50" x2="490" y2="600" />
              <line x1="710" y1="50" x2="710" y2="600" />
              <line x1="820" y1="50" x2="820" y2="600" />
              <line x1="100" y1="330" x2="1100" y2="330" />
            </g>

            {/* 2. Target Anchor */}
            <circle cx="50" cy="50" r="10" stroke="#151515" strokeWidth="0.8" strokeOpacity="0.6" />
            <circle cx="50" cy="50" r="2.5" fill="#151515" />

            {/* 3. Curved Sketch Splines */}
            <path
              d="M 90,270 C 220,100 370,410 600,180 C 800,0 970,330 1110,210"
              stroke="#151515"
              strokeWidth="0.8"
              strokeOpacity="0.5"
              className="sketch-line draw"
            />
            <path
              d="M 130,520 C 310,340 470,590 710,430 C 890,300 1000,540 1090,480"
              stroke="#151515"
              strokeWidth="0.8"
              strokeOpacity="0.5"
              className="sketch-line draw"
              style={{ animationDelay: '0.3s' }}
            />

            {/* 4. Intersection Nodes */}
            <circle cx="295" cy="195" r="7" stroke="#151515" strokeWidth="0.8" fill="#f5f2ea" />
            <circle cx="295" cy="195" r="2" fill="#151515" />

            <circle cx="490" cy="222" r="7" stroke="#151515" strokeWidth="0.8" fill="#f5f2ea" />
            <circle cx="490" cy="222" r="2" fill="#151515" />

            <circle cx="490" cy="495" r="7" stroke="#151515" strokeWidth="0.8" fill="#f5f2ea" />
            <circle cx="490" cy="495" r="2" fill="#151515" />

            <circle cx="820" cy="438" r="7" stroke="#151515" strokeWidth="0.8" fill="#f5f2ea" />
            <circle cx="820" cy="438" r="2" fill="#151515" />

            {/* Star Icon */}
            <polygon points="600,105 603,114 612,114 605,120 607,129 600,123 593,129 595,120 588,114 597,114" stroke="#151515" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />

            {/* 5. SVG Typography */}
            <g fill="#151515" className="font-serif-aln" textAnchor="middle" fontWeight="300">
              <text x="600" y="270" fontSize="126" letterSpacing="-4px">ARRAYED</text>
              <text x="600" y="415" fontSize="126" letterSpacing="-4px">LIKE NONE</text>
              <text x="600" y="520" fontSize="42" letterSpacing="22px" fontWeight="400">A L N</text>
            </g>

            {/* 6. Handwritten Annotations */}
            <text x="960" y="85" fill="#151515" className="font-hand-aln" fontSize="26" transform="rotate(-4 960 85)">
              begin here ↗
            </text>

            <g transform="translate(1010, 535)">
              <text x="0" y="0" fill="#151515" className="font-hand-aln" fontSize="22" transform="rotate(-8)">
                follow the line
              </text>
              <path d="M 35,10 C 45,30 25,50 10,70 M 5,60 L 10,70 L 20,68" stroke="#151515" strokeWidth="0.8" fill="none" />
            </g>

            {/* Bottom Copy Overlay */}
            <line x1="60" y1="465" x2="130" y2="465" stroke="#151515" strokeWidth="0.8" strokeOpacity="0.5" />
            <text x="60" y="495" fill="#151515" fontSize="11" fontFamily="sans-serif">
              <tspan x="60" dy="0">A house of form, distinction and quiet</tspan>
              <tspan x="60" dy="16">confidence.</tspan>
            </text>
            <text x="60" y="565" fill="#151515" className="font-hand-aln" fontSize="24" fontStyle="italic">
              drawn by hand / 01
            </text>
          </svg>

          {/* Interactive Navigation Nodes Overlay */}
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <Link
              href="/house"
              className="pointer-events-auto absolute left-[10%] top-[24%] flex items-center gap-2 group text-[10px] tracking-[0.2em] font-sans uppercase hover:opacity-60 transition"
            >
              <span className="w-[12px] h-[12px] border border-[#151515] rounded-full flex items-center justify-center bg-[#f5f2ea]">
                <span className="w-[3px] h-[3px] bg-[#151515] rounded-full" />
              </span>
              <span>The House</span>
            </Link>

            <Link
              href="/collections"
              className="pointer-events-auto absolute right-[10%] top-[34%] flex items-center gap-2 group text-[10px] tracking-[0.2em] font-sans uppercase hover:opacity-60 transition"
            >
              <span className="w-[12px] h-[12px] border border-[#151515] rounded-full flex items-center justify-center bg-[#f5f2ea]">
                <span className="w-[3px] h-[3px] bg-[#151515] rounded-full" />
              </span>
              <span>Collection 01</span>
            </Link>

            <Link
              href="/atelier"
              className="pointer-events-auto absolute left-[18%] bottom-[20%] flex items-center gap-1.5 group text-[9px] tracking-[0.2em] font-sans uppercase hover:opacity-60 transition"
            >
              <span className="w-[10px] h-[10px] border border-[#151515] rounded-full flex items-center justify-center bg-[#f5f2ea]">
                <span className="w-[2px] h-[2px] bg-[#151515] rounded-full" />
              </span>
              <span>Atelier</span>
            </Link>

            <Link
              href="/archive"
              className="pointer-events-auto absolute right-[19%] bottom-[18%] flex items-center gap-2 group text-[10px] tracking-[0.2em] font-sans uppercase hover:opacity-60 transition"
            >
              <span className="w-[12px] h-[12px] border border-[#151515] rounded-full flex items-center justify-center bg-[#f5f2ea]">
                <span className="w-[3px] h-[3px] bg-[#151515] rounded-full" />
              </span>
              <span>Archive</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 02 / THE HOUSE */}
      <section className="min-h-[85vh] py-32 px-[9vw] grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-t border-black/20 relative" id="house">
        <Link href="/house" className="absolute top-7 right-8 text-[9px] tracking-[0.16em] hover:underline">02 / THE HOUSE ↗</Link>
        <div className="reveal opacity-0 translate-y-8 space-y-6">
          <div className="text-[9px] tracking-[0.24em] uppercase">The House / Philosophy</div>
          <h2 className="font-serif-aln font-light text-[clamp(58px,8vw,120px)] leading-[0.8] tracking-[-0.05em]">Beauty<br />without<br />comparison.</h2>
          <p className="font-serif-aln text-2xl leading-[1.15] max-w-[410px]">ALN creates pieces that do not ask to belong. They belong to themselves.</p>
        </div>
        <div className="reveal opacity-0 translate-y-8 relative min-h-[450px] flex items-center justify-center">
          <div className="w-[70%] max-w-[330px] relative contrast-105 opacity-90">
            <div className="absolute w-[85px] h-[25px] bg-[#b4b0a5]/45 -top-2 left-[20%] -rotate-6 z-10" />
            <img src="https://res.cloudinary.com/vhdlwici/image/upload/v1788347593/ALN-09.png" alt="Editorial" className="w-full aspect-[3/4] object-cover mix-blend-multiply" />
          </div>
          <div className="absolute w-[110px] h-[110px] border border-[#151515] rounded-full right-[5%] top-[30%] opacity-45 flex items-center justify-center">
            <div className="w-[86px] h-[86px] border border-[#151515] rounded-full" />
          </div>
          <div className="absolute font-hand-aln text-[21px] top-[12%] right-0 -rotate-6">form / proportion / presence ↗</div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-20 px-[5vw] border-t border-black/20 relative">
        <div className="reveal opacity-0 translate-y-8 max-w-[1200px] mx-auto text-center space-y-6">
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block">
            Find A Piece
          </span>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full max-w-xl mx-auto flex items-center justify-between border-b border-black/40 py-4 text-left group transition hover:border-black"
          >
            <span className="text-lg md:text-2xl font-serif-aln text-black/40 group-hover:text-black transition">
              Search by name, category, or fabric...
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-black/60 group-hover:text-black">
              [ Search ]
            </span>
          </button>
        </div>
      </section>

      {/* 03 / COLLECTIONS */}
      <section className="py-32 px-[5vw] border-t border-black/20 relative" id="collections">
        <Link href="/collections" className="absolute top-7 right-8 text-[9px] tracking-[0.16em] hover:underline">03 / COLLECTIONS ↗</Link>
        <div className="reveal opacity-0 translate-y-8 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="text-[9px] tracking-[0.24em] uppercase">The Collections</div>
            <h2 className="font-serif-aln font-light text-[clamp(70px,10vw,150px)] leading-[0.72] tracking-[-0.06em] mt-3">FORM</h2>
          </div>
          <p className="max-w-[220px] text-[10px] leading-[1.7]">A study in silhouette, movement and the space between the body and the garment.</p>
        </div>

        {collections.length > 0 && (
          <div className="max-w-[1200px] mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((c) => (
                <Link key={c.id} href={`/collections/${c.slug}`} className="reveal opacity-0 translate-y-8 group block space-y-3">
                  <div className="aspect-[4/5] bg-neutral-300 overflow-hidden relative">
                    <img src={c.cover_image || ''} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-2 border border-black/20 pointer-events-none" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] tracking-[0.14em] uppercase border-b border-black/28 pb-2">
                    <span>{c.year || ''}</span>
                    <span>{c.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="max-w-[1200px] mx-auto">
            <div className="text-[9px] tracking-[0.24em] uppercase mb-8 opacity-60">Latest Pieces</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p) => (
                <div key={p.id} className="reveal opacity-0 translate-y-8">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 04 / ATELIER */}
      <section className="py-32 px-[5vw] border-t border-black/20 relative" id="atelier">
        <Link href="/atelier" className="absolute top-7 right-8 text-[9px] tracking-[0.16em] hover:underline">04 / THE ATELIER ↗</Link>
        <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="reveal opacity-0 translate-y-8 md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <div className="text-[9px] tracking-[0.24em] uppercase">Behind the House</div>
              <h2 className="font-serif-aln font-light text-[clamp(70px,10vw,150px)] leading-[0.7] tracking-[-0.06em]">THE<br />ATELIER</h2>
            </div>
            <p className="max-w-[250px] text-[10px] leading-[1.7]">Where an idea becomes a line, a line becomes a shape, and a shape becomes something you can wear.</p>
          </div>
          {[
            { img: 'https://res.cloudinary.com/vhdlwici/image/upload/f_auto,q_auto/ALN-08_hoodie_army-green_serries_II', label: '01 / MATERIAL', sub: 'STUDY', note: 'texture matters.' },
            { img: 'https://res.cloudinary.com/vhdlwici/image/upload/v1788340969/ALN-05_jacket_black.png', label: '02 / CUT', sub: 'CONSTRUCTION', note: 'cut here ↘' },
            { img: 'https://res.cloudinary.com/vhdlwici/image/upload/v1788341004/ALN-01_BODY_HUGGED_T-SHIRT.png', label: '03 / HAND', sub: 'FINISH', note: 'slowly.' },
          ].map((item, i) => (
            <div key={i} className={`reveal opacity-0 translate-y-8 relative space-y-2 ${i === 1 ? 'md:mt-20' : ''}`}>
              <div className="aspect-[4/5] overflow-hidden bg-neutral-300">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex justify-between text-[8px] tracking-[0.15em] uppercase border-b border-black/28 pb-2">
                <span>{item.label}</span><span>{item.sub}</span>
              </div>
              <div className="absolute -top-5 -left-6 font-hand-aln text-[20px] -rotate-6">{item.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 / ARCHIVE */}
      <section className="py-32 px-[5vw] border-t border-black/20 relative" id="archive">
        <Link href="/archive" className="absolute top-7 right-8 text-[9px] tracking-[0.16em] hover:underline">05 / THE ARCHIVE ↗</Link>
        <div className="max-w-[1250px] mx-auto space-y-12">
          <div className="reveal opacity-0 translate-y-8 flex flex-col md:flex-row justify-between items-start">
            <div>
              <div className="text-[9px] tracking-[0.24em] uppercase">Selected Records</div>
              <h2 className="font-serif-aln font-light text-[clamp(75px,11vw,160px)] leading-[0.7] tracking-[-0.07em]">THE<br />ARCHIVE</h2>
            </div>
            <span className="font-hand-aln text-[22px] italic">keep everything / remember the beginning</span>
          </div>
          <div className="reveal opacity-0 translate-y-8 border-t border-black divide-y divide-black/28">
            {archives.map((item, i) => (
              <Link key={item.id} href={`/archive/${item.slug}`} className="py-5 px-2 grid grid-cols-12 items-center hover:px-6 transition-all duration-300 block">
                <span className="col-span-2 text-[9px] tracking-[0.16em]">00{i + 1}</span>
                <span className="col-span-8 font-serif-aln text-3xl md:text-4xl">{item.title}</span>
                <span className="col-span-2 text-right text-[9px] tracking-[0.16em]">{item.year || ''}</span>
              </Link>
            ))}
            {!isLoading && archives.length === 0 && (
              <p className="py-8 text-center font-hand-aln text-xl opacity-40">archive entries coming soon</p>
            )}
          </div>
        </div>
      </section>

      {/* 06 / JOURNAL */}
      <section className="py-32 px-[5vw] border-t border-black/20 relative" id="journal">
        <Link href="/journal" className="absolute top-7 right-8 text-[9px] tracking-[0.16em] hover:underline">06 / JOURNAL ↗</Link>
        <div className="max-w-[1250px] mx-auto space-y-12">
          <div className="reveal opacity-0 translate-y-8 flex flex-col md:flex-row justify-between items-start">
            <div>
              <div className="text-[9px] tracking-[0.24em] uppercase">Notes from ALN</div>
              <h2 className="font-serif-aln font-light text-[clamp(70px,10vw,150px)] leading-[0.7] tracking-[-0.06em]">JOURNAL</h2>
            </div>
            <span className="font-hand-aln text-[22px] italic">words / images / observations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journals.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.slug}`} className="reveal opacity-0 translate-y-8 group space-y-3 block">
                <div className="aspect-[4/5] bg-neutral-300 overflow-hidden">
                  <img src={entry.cover_image || ''} alt={entry.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="text-[8px] tracking-[0.16em] uppercase">Entry / {entry.date || ''}</div>
                <h3 className="font-serif-aln text-2xl">{entry.title}</h3>
                <p className="text-[10px] leading-[1.6] opacity-80">{entry.excerpt}</p>
              </Link>
            ))}
            {!isLoading && journals.length === 0 && (
              <p className="col-span-3 py-8 text-center font-hand-aln text-xl opacity-40">journal entries coming soon</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-[5vw] border-t border-black/20 text-center relative">
        <div className="reveal opacity-0 translate-y-8 max-w-[600px] mx-auto space-y-6">
          <div className="text-[9px] tracking-[0.24em] uppercase">The House / End of Page</div>
          <h2 className="font-serif-aln font-light text-[clamp(60px,9vw,140px)] leading-[0.72] tracking-[-0.06em]">ARRAYED<br />LIKE NONE</h2>
          <div className="text-[12px] tracking-[0.2em] font-medium">A L N</div>
          <div className="font-hand-aln text-[26px]">not made to resemble.</div>
          <a href="#top" className="inline-block border-b border-black pb-1 text-[9px] tracking-[0.2em] uppercase mt-4 hover:opacity-60 transition">Return to top ↑</a>
        </div>
      </section>

      {/* SEARCH MODAL OVERLAY */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}