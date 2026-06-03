// Responsive design utilities and helpers

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  mobile: 320,
  mobileLg: 480,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1280,
  desktopXl: 1536,
}

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth

  if (width < BREAKPOINTS.mobileLg) return 'mobile'
  if (width < BREAKPOINTS.tablet) return 'mobileLg'
  if (width < BREAKPOINTS.desktop) return 'tablet'
  if (width < BREAKPOINTS.desktopLg) return 'desktop'
  if (width < BREAKPOINTS.desktopXl) return 'desktopLg'
  return 'desktopXl'
}

// Check if device is mobile
export const isMobile = () => window.innerWidth < BREAKPOINTS.tablet

// Check if device is tablet
export const isTablet = () =>
  window.innerWidth >= BREAKPOINTS.tablet && window.innerWidth < BREAKPOINTS.desktop

// Check if device is desktop
export const isDesktop = () => window.innerWidth >= BREAKPOINTS.desktop

// Get responsive value based on breakpoint
export const getResponsiveValue = (values) => {
  const breakpoint = getCurrentBreakpoint()
  return values[breakpoint] || values.mobile
}

// Responsive container sizes
export const CONTAINER_SIZES = {
  mobile: '100%',
  mobileLg: '95%',
  tablet: '90%',
  desktop: '80%',
  desktopLg: '1200px',
  desktopXl: '1400px',
}

// Responsive padding
export const RESPONSIVE_PADDING = {
  mobile: 'p-4',
  tablet: 'p-6',
  desktop: 'p-8',
}

// Responsive gap
export const RESPONSIVE_GAP = {
  mobile: 'gap-3',
  tablet: 'gap-4',
  desktop: 'gap-6',
}

// Responsive font sizes
export const RESPONSIVE_FONT = {
  title: 'text-2xl md:text-3xl lg:text-4xl',
  subtitle: 'text-lg md:text-xl lg:text-2xl',
  body: 'text-sm md:text-base lg:text-lg',
  caption: 'text-xs md:text-sm',
}

// Responsive grid columns
export const RESPONSIVE_GRID = {
  auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  duo: 'grid-cols-1 md:grid-cols-2',
  trio: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  quad: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

// Safe area insets for notch devices
export const SAFE_AREA = {
  paddingTop: 'pt-[max(1rem,env(safe-area-inset-top))]',
  paddingBottom: 'pb-[max(1rem,env(safe-area-inset-bottom))]',
  paddingLeft: 'pl-[max(1rem,env(safe-area-inset-left))]',
  paddingRight: 'pr-[max(1rem,env(safe-area-inset-right))]',
}
