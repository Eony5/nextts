import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { getPastLaunches } from '../lib/spacexApi'

interface IndexPageProps {
  launches: Array<SpaceXLaunch>
  error: boolean
}

interface SpaceXLaunch {
  id: number
  timeSince: string
  location: string
  rocket_name: string
}

const IndexPage: NextPage<IndexPageProps> = ({ launches, error }) => {
  if (error) {
    return (
      <main>
        An error has occurred when fetching the launches
        <style jsx>{`
          main {
            color: white;
            font-family: 'D-DIN';
            font-weight: bold;
            text-align: center;
          }
        `}</style>
      </main>
    )
  }

  return (
    <main>
      <div className="launches">
        {launches.map((launch: SpaceXLaunch) => (
          <Link href={`/${launch.id}`} key={launch.id}>
            <div className="launch">
              <div>
                <img src="/images/rocket.svg" alt="rocket" className="rocket" />
                {launch.rocket_name}
              </div>
              <div>
                <img src="/images/location.svg" alt="location" /> {launch.location}
              </div>
              <div>
                <img src="/images/clock.svg" alt="clock" />
                {launch.timeSince}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        main {
          width: 100%;

          > .launches {
            width: 100%;

            display: flex;
            flex-direction: column;
            align-items: center;

            > .launch {
              display: flex;
              justify-content: flex-start;
              align-items: center;

              max-width: 850px;
              width: 100%;

              padding: 15px;
              border-radius: 6px;
              background: rgba(#fff, 0.1);

              color: white;
              font-family: 'D-DIN';

              user-select: none;
              cursor: pointer;

              transition: 300ms;
              &:hover {
                background-color: rgba(#fff, 0.15);
              }

              &:active {
                transform: scale(0.95);
              }

              &:not(:last-child) {
                margin-bottom: 15px;
              }

              > div {
                display: flex;
                align-items: center;
                font-size: 16px;
                line-height: 20px;
                color: rgba(#fff, 0.9);

                > img {
                  width: 16px;
                  margin-right: 9px;
                  opacity: 0.5;

                  &.rocket {
                    width: 10px;
                  }
                }

                &:not(:last-child) {
                  margin-right: 30px;
                }

                &:last-child {
                  margin-left: auto;
                }
              }
            }
          }
        }
      `}</style>
    </main>
  )
}

export default IndexPage

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const launches = await getPastLaunches(3)

    return {
      props: {
        launches,
        error: false,
      },
    }
  } catch (e) {
    return {
      props: {
        launches: null,
        error: true,
      },
    }
  }
}
