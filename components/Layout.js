import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <div
        style={{
          fontSize: '0.8rem',
          background: 'var(--color-primary)',
          color: '#eee',
          padding: '1rem 0',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--large-container-width)',
            padding: '0 2rem',
            margin: 'auto',
          }}
        >
          原始碼可在{' '}
          <a
            href="https://github.com/IBaseAsyncOrgFactoryProvider/ic-im-in-cse-2022"
            style={{ textDecoration: 'underline' }}
          >
            GitHub
          </a>{' '}
          取得。
        </div>
      </div>
    </>
  )
}
