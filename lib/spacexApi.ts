import { gql, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'

const API_URL = 'http://api.spacex.land/graphql/'

export interface SpaceXLaunch {
  id: number
  timeSince: string
  mission_name: string
  location: string
  rocket_name: string
  video_url: string
}

// Returns initialized Apollo client
function client(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache(),
  })
}

// Returns the past $limit launches.
export async function getPastLaunches(limit: number): Promise<Array<SpaceXLaunch>> {
  const { data } = await client().query({
    query: gql`
      query FetchPastLaunches($limit: Int) {
        launchesPast(limit: $limit) {
          id
          launch_date_local
          launch_site {
            site_name_long
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
    variables: {
      limit,
    },
  })

  interface LaunchesPastResult {
    id: number
    launch_date_local: string
    launch_site: {
      site_name_long: string
    }
    rocket: {
      rocket_name: string
    }
  }

  return data.launchesPast.map((launch: LaunchesPastResult) => {
    return {
      id: launch.id,
      timeSince: formatDistanceToNow(new Date(launch.launch_date_local)) + ' ago',
      location: launch.launch_site.site_name_long,
      rocket_name: launch.rocket.rocket_name,
    }
  })
}

// Returns the $id launch.
export async function getLaunch(id: string): Promise<SpaceXLaunch> {
  const { data } = await client().query({
    query: gql`
      query GetLaunch($launchID: ID!) {
        launch(id: $launchID) {
          id
          launch_date_local
          mission_name
          rocket {
            rocket_name
          }
          launch_site {
            site_name_long
          }
          links {
            video_link
          }
        }
      }
    `,
    variables: {
      launchID: id ? id : null,
    },
  })

  return {
    id: data.launch.id,
    timeSince: formatDistanceToNow(new Date(data.launch.launch_date_local)) + ' ago',
    mission_name: data.launch.mission_name,
    location: data.launch.launch_site.site_name_long,
    rocket_name: data.launch.rocket.rocket_name,
    video_url: data.launch.links.video_link,
  }
}
