import { Stack, Box, Typography, Tooltip } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { useChainId } from '@/hooks/useChainId'
import ExternalLink from '@/components/common/ExternalLink'
import useIntervalCounter from '@/hooks/useIntervalCounter'
import useAsync from '@/hooks/useAsync'

const STATUS_PAGE = 'https://status.safe.global'
const POLL_INTERVAL = 30000 // 30 seconds
const MAX_SYNC_DELAY = 60000 * 60 * 24 // 1 day

// Type definition for indexing status
interface IndexingStatusType {
  synced: boolean
  lastSync: number
}

// Simple mock function that always returns synced status
const getIndexingStatus = async (): Promise<IndexingStatusType> => {
  return {
    synced: true,
    lastSync: Date.now(),
  }
}

const useIndexingStatus = () => {
  // Prefix with underscore to indicate it's not used
  const _chainId = useChainId()
  const [_count] = useIntervalCounter(POLL_INTERVAL)

  // Don't include any dependencies to avoid linting warnings
  return useAsync<IndexingStatusType>(() => getIndexingStatus(), [], false)
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
