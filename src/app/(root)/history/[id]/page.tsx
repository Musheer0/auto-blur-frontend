import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getQueryClient, trpc } from "@/trpc/server"
import GenerationView from "@/components/history/generation-page/generation-view"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Generation({
  params,
}: PageProps) {
  const { id } = await params

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    trpc.crud.getGenerationById.queryOptions({
      generationID: id,
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GenerationView id={id}/>
    </HydrationBoundary>
  )
}