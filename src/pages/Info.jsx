import styles from './Info.module.scss'
import logo from '../assets/logo.png'

const Info = ({children}) => {
  return( 
    <div className={`section has-text-centered ${styles.section}`}>
      
      <figure className="image is-512x512">
        <img src={logo}/>
      </figure>

      <span className="is-size-2 has-text-weight-bold has-text-grey">{children}</span>
    </div>
  )
}

export default Info
