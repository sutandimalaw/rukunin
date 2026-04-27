import { type NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/sign-up-success',
  '/auth/error',
  '/auth/pending-approval',
  '/login',
  '/landing',
]

// Halaman yang hanya boleh diakses ADMIN
const ADMIN_ONLY_PATHS = [
  '/finance',
  '/residents',
  '/iuran-warga',
  '/announcements',
  '/report',
  '/kelola-pengguna',
]

// Halaman yang hanya boleh diakses WARGA
const WARGA_ONLY_PATHS = ['/portal']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const refreshToken = request.cookies.get('rukunin-refresh-token')

  if (!refreshToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const decoded = jwtDecode<{ role?: string }>(refreshToken.value)
    const role = decoded.role ?? 'ADMIN'

    // Warga mencoba akses halaman admin → redirect ke portal
    if (role === 'WARGA' && ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/portal', request.url))
    }

    // Admin mencoba akses halaman portal → redirect ke home
    if (role === 'ADMIN' && WARGA_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch {
    // Token tidak bisa di-decode → lanjutkan, biarkan API yang reject
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
