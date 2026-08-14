"use client"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'

const useCreatePotralSessionSubscription = () => {
  const trpc= useTRPC()
  return useMutation(trpc.usage.view_subscription.mutationOptions())
}

export default useCreatePotralSessionSubscription