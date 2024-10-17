import ChainIndicator from '@/components/common/ChainIndicator'
import { Box } from '@mui/material'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import css from './styles.module.css'

const NetworkLogosList = ({
  networks,
  showHasMore = false,
}: {
  networks: Pick<ChainInfo, 'chainId'>[]
  showHasMore?: boolean
}) => {
  const MAX_NUM_VISIBLE_CHAINS = 4
  const visibleChains = showHasMore ? networks.slice(0, MAX_NUM_VISIBLE_CHAINS) : networks

  return (
    <Box className={css.networks}>
      {visibleChains.map((chain) => (
        <ChainIndicator key={chain.chainId} chainId={chain.chainId} onlyLogo inline />
      ))}
      {showHasMore && networks.length > MAX_NUM_VISIBLE_CHAINS && (
        <Box className={css.moreChainsIndicator}>+{networks.length - MAX_NUM_VISIBLE_CHAINS}</Box>
      )}
    </Box>
  )
}

export default NetworkLogosList
