import { Stack, Box, Typography, Tooltip } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { useChainId } from '@/hooks/useChainId'
import ExternalLink from '@/components/common/ExternalLink'
import useIntervalCounter from '@/hooks/useIntervalCounter'
import useAsync from '@/hooks/useAsync'
import { getTransactionQueueByChain } from '@safe-global/safe-gateway-typescript-sdk'

const STATUS_PAGE = 'https://status.safe.global'
const POLL_INTERVAL = 30000 // 30 seconds
const MAX_SYNC_DELAY = 60000 * 60 * 24 // 1 day

// Type definition for indexing status
interface IndexingStatusType {
  synced: boolean
  lastSync: number
}

// Helper function to get indexing status
const getIndexingStatus = async (chainId?: string): Promise<IndexingStatusType> => {
  if (!chainId) {
    return { synced: false, lastSync: Date.now() }
  }

  try {
    // Get transaction queue which returns data that includes indexing status
    const queue = await getTransactionQueueByChain(chainId)
    return {
      synced: queue.results.length === queue.count,
      lastSync: Date.now(),
    }
  } catch (error) {
    console.error('Error fetching indexing status', error)
    return { synced: false, lastSync: Date.now() }
  }
}

const useIndexingStatus = () => {
  const chainId = useChainId()
  const [count] = useIntervalCounter(POLL_INTERVAL)

  // Don't use count as a dependency to avoid the linting warning
  return useAsync<IndexingStatusType>(() => getIndexingStatus(chainId), [chainId], false)
}

const STATUSES = {
  synced: {
    color: 'success',
    text: 'Synced',
  },
  slow: {
    color: 'warning',
    text: 'Slow network',
  },
  outOfSync: {
    color: 'error',
    text: 'Out of sync',
  },
}

const getStatus = (synced: boolean, lastSync: number) => {
  let status = STATUSES.outOfSync

  if (synced) {
    status = STATUSES.synced
  } else if (Date.now() - lastSync > MAX_SYNC_DELAY) {
    status = STATUSES.slow
  }

  return status
}

const IndexingStatus = () => {
  const [data] = useIndexingStatus()

  if (!data) {
    return null
  }

  const status = getStatus(data.synced, data.lastSync)

  const time = formatDistanceToNow(data.lastSync, { addSuffix: true })

  return (
    <Tooltip title={`Last synced with the blockchain ${time}`} placement="right" arrow>
      <Stack direction="row" spacing={2} alignItems="center" px={3} py={1.5}>
        <Box width={10} height={10} borderRadius="50%" border={`2px solid var(--color-${status.color}-main)`} />

        <ExternalLink href={STATUS_PAGE} noIcon flex={1}>
          <Typography variant="body2">{status.text}</Typography>
        </ExternalLink>

        <ExternalLink href={STATUS_PAGE} sx={{ color: 'text.secondary', transform: 'translateY(3px)' }} />
      </Stack>
    </Tooltip>
  )
}

export default IndexingStatus
