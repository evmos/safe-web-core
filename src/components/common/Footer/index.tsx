import type { SyntheticEvent, ReactElement } from 'react'
import { Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { useAppDispatch } from '@/store'
import { openCookieBanner } from '@/store/popupSlice'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
//import AppstoreButton from '../AppStoreButton'
import ExternalLink from '../ExternalLink'
// import MUILink from '@mui/material/Link'

const footerPages = [
  AppRoutes.welcome,
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  const onCookieClick = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(openCookieBanner({}))
  }

  return (
    <footer className={css.container}>
      <ul>
        <li>
          <Typography variant="caption">&copy;2022–{new Date().getFullYear()} Evmos</Typography>
        </li>
        <li>
          <ExternalLink noIcon href="https://evmos.org/">
            Evmos Network
          </ExternalLink>
        </li>
        <li>
          <ExternalLink noIcon href="https://evmos.dev/">
            Evmos Documentation
          </ExternalLink>
        </li>
        {/* <li>
          <ExternalLink noIcon href="https://safe.global/terms">
            Terms
          </ExternalLink>
        </li>
        <li>
          <Link href={AppRoutes.privacy} passHref>
            <MUILink>Privacy</MUILink>
          </Link>
        </li>
        <li>
          <ExternalLink noIcon href="https://safe.global/licenses">
            Licenses
          </ExternalLink>
        </li>
        <li>
          <ExternalLink noIcon href="https://safe.global/imprint">
            Imprint
          </ExternalLink>
        </li> */}
        <li>
          {/* <ExternalLink noIcon href="https://safe.global/cookie">
            Cookie Policy
          </ExternalLink>
          &nbsp;&mdash;&nbsp; */}
          <Link href="#" onClick={onCookieClick}>
            Cookie Preferences
          </Link>
        </li>
        <li>
          <ExternalLink noIcon href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`}>
            v{packageJson.version}
          </ExternalLink>
        </li>
        {/* <li>
          <AppstoreButton placement="footer" />
        </li> */}
      </ul>
    </footer>
  )
}

export default Footer
