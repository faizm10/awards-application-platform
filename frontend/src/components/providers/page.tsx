"use client"

import type React from "react"

import { ApolloProvider } from "@apollo/client"
import { apolloClient } from "@/lib/graphql/client"

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
