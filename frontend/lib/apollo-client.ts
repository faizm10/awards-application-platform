import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const httpLink = createHttpLink({
  uri: typeof window === "undefined" ? "http://localhost:3000/api/graphql" : "/api/graphql",
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
})
