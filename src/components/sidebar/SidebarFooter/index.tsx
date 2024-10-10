import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'

import {
  SidebarList,
  SidebarListItemButton,
  SidebarListItemIcon,
  SidebarListItemText,
} from '@/components/sidebar/SidebarList'
import { BEAMER_SELECTOR, loadBeamer } from '@/services/beamer'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectCookies, CookieAndTermType } from '@/store/cookiesAndTermsSlice'
import { openCookieBanner } from '@/store/popupSlice'
//import BeamerIcon from '@/public/images/sidebar/whats-new.svg'
import HelpCenterIcon from '@/public/images/sidebar/help-center.svg'
import SuggestionIcon from '@/public/images/sidebar/lightbulb_icon.svg'
import { Link, ListItem, SvgIcon, Typography } from '@mui/material'
import DebugToggle from '../DebugToggle'
import { HELP_CENTER_URL, IS_PRODUCTION } from '@/config/constants'
import Track from '@/components/common/Track'
import ProtofireLogo from '@/public/images/protofire-logo.svg'
import { OVERVIEW_EVENTS } from '@/services/analytics/events/overview'
import { useCurrentChain } from '@/hooks/useChains'
import darkPalette from '@/components/theme/darkPalette'

const SUGGESTION_PATH =
  'https://docs.google.com/forms/d/e/1FAIpQLSfojsADYCiWq9AqbLqsUTzCDSpA8FMgdAQp0Pyl0BOeurlq9A/viewform?usp=sf_link'

const SidebarFooter = (): ReactElement => {
  const dispatch = useAppDispatch()
  const cookies = useAppSelector(selectCookies)
  const chain = useCurrentChain()

  const hasBeamerConsent = useCallback(() => cookies[CookieAndTermType.UPDATES], [cookies])

  useEffect(() => {
    // Initialise Beamer when consent was previously given
    if (hasBeamerConsent() && chain?.shortName) {
      loadBeamer(chain.shortName)
    }
  }, [hasBeamerConsent, chain?.shortName])

  const handleBeamer = () => {
    if (!hasBeamerConsent()) {
      dispatch(openCookieBanner({ warningKey: CookieAndTermType.UPDATES }))
    }
  }

  return (
    <SidebarList>
      {!IS_PRODUCTION && (
        <ListItem disablePadding>
          <DebugToggle />
        </ListItem>
      )}

      {/* <Track {...OVERVIEW_EVENTS.WHATS_NEW}>
        <ListItem disablePadding>
          <SidebarListItemButton id={BEAMER_SELECTOR} onClick={handleBeamer}>
            <SidebarListItemIcon color="primary">
              <BeamerIcon />
            </SidebarListItemIcon>
            <SidebarListItemText data-testid="list-item-whats-new" bold>
              What&apos;s new
            </SidebarListItemText>
          </SidebarListItemButton>
        </ListItem>
      </Track> */}

      <Track {...OVERVIEW_EVENTS.HELP_CENTER}>
        <ListItem disablePadding>
          <a target="_blank" rel="noopener noreferrer" href={HELP_CENTER_URL} style={{ width: '100%' }}>
            <SidebarListItemButton>
              <SidebarListItemIcon color="primary">
                <HelpCenterIcon />
              </SidebarListItemIcon>
              <SidebarListItemText data-testid="list-item-need-help" bold>
                Need help?
              </SidebarListItemText>
            </SidebarListItemButton>
          </a>
        </ListItem>
      </Track>
      <Track {...OVERVIEW_EVENTS.SUGGESTIONS}>
        <ListItem disablePadding>
          <a target="_blank" rel="noopener noreferrer" href={SUGGESTION_PATH} style={{ width: '100%' }}>
            <SidebarListItemButton
              id={BEAMER_SELECTOR}
              style={{ backgroundColor: '#12FF80', color: 'black' }}
              onClick={handleBeamer}
            >
              <SidebarListItemIcon color="primary">
                <SuggestionIcon />
              </SidebarListItemIcon>
              <SidebarListItemText bold>New Features Suggestion?</SidebarListItemText>
            </SidebarListItemButton>
          </a>
        </ListItem>
      </Track>
      <ListItem>
        <SidebarListItemText>
          <Typography variant="caption">
            Supported by{' '}
            <SvgIcon
              component={ProtofireLogo}
              inheritViewBox
              fontSize="small"
              sx={{ verticalAlign: 'middle', mx: 0.5 }}
            />
            <Link href="https://protofire.io" sx={{ color: darkPalette.primary.main, textDecoration: 'none' }}>
              Protofire
            </Link>
          </Typography>
        </SidebarListItemText>
      </ListItem>
    </SidebarList>
  )
}

export default SidebarFooter
