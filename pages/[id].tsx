import { GetServerSideProps, NextPage } from 'next'
import { SpaceXLaunch, getLaunch } from '../lib/spacexApi'

interface LaunchPageProps {
  launch: SpaceXLaunch
  error: boolean
}

const LaunchPage: NextPage<LaunchPageProps> = ({ launch, error }) => {
  if (error)
    return (
      <div className="error">
        An error occurred fetching the launch data.
        <style jsx>{`
          .error {
            color: white;
            font-family: 'D-DIN';
            font-size: 16px;
            text-align: center;
          }
        `}</style>
      </div>
    )

  return (
    <main>
      <div className="launch-details">
        <div className="info">
          <div className="infoTitle">Mission</div>
          <div className="infoValue">{launch.mission_name}</div>
        </div>

        <div className="info">
          <div className="infoTitle">Rocket type</div>
          <div className="infoValue">{launch.rocket_name}</div>
        </div>

        <div className="info">
          <div className="infoTitle">Location</div>
          <div className="infoValue">{launch.location}</div>
        </div>

        <div className="info">
          <div className="infoTitle">When</div>
          <div className="infoValue">{launch.timeSince}</div>
        </div>
      </div>

      <EmbeddedYoutubeVideo videoUrl={launch.video_url}></EmbeddedYoutubeVideo>

      <style jsx>
        {`
          main {
            > .launch-details {
              display: flex;
              justify-content: space-between;

              padding: 20px;
              border-radius: 6px;
              background: rgba(#fff, 0.09);

              @media screen and (max-width: 800px) {
                flex-direction: column;
              }

              > .info {
                display: flex;
                flex-direction: column;

                max-width: 200px;

                color: white;
                font-family: 'D-DIN';
                letter-spacing: 1px;
                font-size: 14px;

                @media screen and (max-width: 800px) {
                  &:not(:last-child) {
                    margin-bottom: 15px;
                  }
                }

                &:last-child {
                  @media screen and (min-width: 800px) {
                    > .infoTitle {
                      text-align: right;
                    }
                  }
                }

                > .infoTitle {
                  font-weight: bold;
                  text-transform: uppercase;
                  margin-bottom: 5px;
                }

                > .infoValue {
                  font-weight: normal;
                  line-height: 20px;
                  opacity: 0.8;
                }
              }
            }
            > .backButton {
              display: inline-flex;
              align-items: center;

              padding: 15px;
              border-radius: 6px;

              font-size: 14px;
              color: white;
              font-family: 'D-DIN';
              letter-spacing: 1px;

              background: rgba(#fff, 0.15);

              opacity: 0.7;

              user-select: none;
              cursor: pointer;

              transition: 300ms;
              &:hover {
                opacity: 1;
              }

              > img {
                width: 14px;
                margin-right: 10px;
              }
            }
          }
        `}
      </style>
    </main>
  )
}

interface EmbeddedYoutubeVideoProps {
  videoUrl: string
}

const EmbeddedYoutubeVideo = ({ videoUrl }: EmbeddedYoutubeVideoProps): JSX.Element => {
  try {
    if (!videoUrl)
      return (
        <span className="error">
          No video found{' '}
          <style jsx>{`
            .error {
              color: white;
              font-family: 'D-DIN';
              font-weight: bold;
              text-align: center;
            }
          `}</style>
        </span>
      )

    const videoId = videoUrl.split('/').pop()
    const embedUrl = `https://www.youtube.com/embed/${videoId}`

    return (
      <div className="embeddedVideo">
        <div className="left"></div>
        <iframe
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <style jsx>{`
          .embeddedVideo {
            > iframe {
              width: 100%;
              height: 500px;
              margin-top: 50px;
            }
          }
        `}</style>
      </div>
    )
  } catch (e) {
    return <div>An error occurred displaying the launch video</div>
  }
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params || !params.id) throw new Error('Undefined launch ID')

    const { id } = params
    const launch = await getLaunch(id as string)

    return {
      props: {
        launch,
        error: false,
      },
    }
  } catch (e) {
    return {
      props: {
        launch: null,
        error: true,
      },
    }
  }
}

export default LaunchPage
