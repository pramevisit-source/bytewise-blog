/* ============================================
   ByteWise — Main JavaScript
   Navigation, animations, search, interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initFadeAnimations();
    initSearch();
    initSmoothScroll();
    initNewsletterForm();
});

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            btn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ---------- Scroll Effects (Header) ---------- */
function initScrollEffects() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ---------- Fade-In on Scroll (IntersectionObserver) ---------- */
function initFadeAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    elements.forEach((el) => observer.observe(el));
}

/* ---------- Search Filter ---------- */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.article-card');

        cards.forEach((card) => {
            const title = card.querySelector('.article-card__title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.article-card__excerpt')?.textContent.toLowerCase() || '';
            const category = card.querySelector('.article-card__category')?.textContent.toLowerCase() || '';

            const matches = title.includes(query) || excerpt.includes(query) || category.includes(query);

            card.style.display = matches ? '' : 'none';

            // Animate back in
            if (matches) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                requestAnimationFrame(() => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }
        });

        // Show "no results" message
        const grid = document.querySelector('.articles-grid');
        if (!grid) return;

        let noResults = grid.querySelector('.no-results');
        const visibleCards = grid.querySelectorAll('.article-card[style*="display: none"]');

        if (visibleCards.length === cards.length && query.length > 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);';
                noResults.innerHTML = `<p style="font-size: 1.125rem;">No articles found for "<strong>${query}</strong>"</p><p style="font-size: 0.875rem; margin-top: 0.5rem;">Try a different search term</p>`;
                grid.appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    });
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 72;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });

            // Update active state in TOC
            document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
            anchor.classList.add('active');
        });
    });
}

/* ---------- Newsletter Form ---------- */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button');

        if (!input || !input.value) return;

        // Visual feedback
        const originalText = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'var(--accent-green)';
        input.value = '';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

/* ---------- Active Nav Link Highlight ---------- */
(function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(link => {
        const linkPath = link.getAttribute('href')?.split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
})();
