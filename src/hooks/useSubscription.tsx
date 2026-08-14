"use client"
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useSubscription = () => {
  const trpc= useTRPC()
  return useQuery(trpc.usage.getUsage.queryOptions())
}

export default useSubscription