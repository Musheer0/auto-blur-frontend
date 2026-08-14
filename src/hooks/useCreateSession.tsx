"use client"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'

const useCreateSessionSubscription = () => {
  const trpc= useTRPC()
  return useMutation(trpc.usage.create_session.mutationOptions())
}

export default useCreateSessionSubscription