import { NextPage } from 'next'
import Link from 'next/link'

interface LayoutPageProps {
  children: JSX.Element
}

const Layout: NextPage<LayoutPageProps> = ({ children }) => (
  <div className="layout">
    <Header />
    {children}

    <style jsx>{`
      .layout {
        padding: 50px;
      }
    `}</style>
  </div>
)

const Header = (): JSX.Element => (
  <header>
    <Link href="/">
      <img src="/images/spacex-logo.svg" alt="SpaceX logo" />
    </Link>

    <style jsx>{`
      header {
        width: 100%;
        margin-bottom: 50px;

        display: flex;
        flex-direction: column;
        align-items: center;

        > img {
          width: 300px;
          cursor: pointer;
        }

        > span {
          display: inline-block;
          margin-top: 15px;

          font-family: 'D-DIN Exp';
          font-size: 18px;
          font-weight: bold;
          color: rgba(#fff, 0.5);
          letter-spacing: 1px;

          transform: translateX(-10px);
        }
      }
    `}</style>
  </header>
)

export default Layout
