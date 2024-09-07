import EmblaCarousel from 'https://cdn.jsdelivr.net/npm/embla-carousel@latest/embla-carousel.esm.js'

const viewportNode = document.querySelector('.embla__viewport')

const prevButtonNode = document.querySelector('.embla__prev')
const nextButtonNode = document.querySelector('.embla__next')

const embla = EmblaCarousel(viewportNode, { loop: true })

prevButtonNode.addEventListener('click', embla.scrollPrev, false)
nextButtonNode.addEventListener('click', embla.scrollNext, false)